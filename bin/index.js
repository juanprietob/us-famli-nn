#!/usr/bin/env node

const MedImgReader = require('med-img-reader');
const ImgPadResampleLib = require('itk-image-pad-resample');
const RunPredictionLib = require('..');
const argv = require('minimist')(process.argv.slice(2));
const _ = require('underscore');
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const csvstringify = require('csv-stringify');
const { spawn } = require('child_process');

const help = function(){
    console.error("Help: Run prediction in the ultrasound images");
    console.error("Required:");
    console.error("--dir <directory>")
    console.error("--img <input path to image>");
    console.error("--type <prediction type (accepted multiple types to concatenate the predictions)>");
    console.error("--out <output filename>");
    console.error("--out_spc <set to this if specified, otherwise calculated>");
}

if(argv["h"] || argv["help"] || (!argv["img"] && !argv["dir"])){
    help();
    process.exit(1);
}

const writeCSV = (outfilename, data_sub)=>{
	return new Promise((resolve, reject)=>{
		var keys = _.reduce(data_sub, (memo, sub)=>{
			return _.uniq(_.union(memo, _.keys(sub)));
		}, []);
		
		var outstream = fs.createWriteStream(outfilename);
		outstream.on('finish', (err)=>{
			if(err){
				reject(err);
			}else{
				resolve();
			}
		});
		
		csvstringify(data_sub, {
		  header: true,
		  columns: keys
		})
		.pipe(outstream);
	})
}

const readDir = (dirname)=>{
	return Promise.map(fs.readdirSync(dirname), (filename)=>{
	  var full_path = path.join(dirname, filename);
	  var stats = fs.statSync(full_path);
	  if(stats.isDirectory()){
	    return readDir(full_path);
	  }else{
	  	var ext = path.extname(full_path);
	  	if(ext.match(new RegExp(/nrrd|nii|gz|dcm|jpg|png|mhd/))){
	  		return full_path;
	  	}
	  }
	})
	.then((files)=>{return _.compact(_.flatten(files))});
}

const mkdirp = (dirname)=>{
	var currentdir = "";
	_.each(dirname.split(path.sep), (d)=>{
		currentdir += d + path.sep;
		if(currentdir != path.sep && !fs.existsSync(currentdir)){
			try{
				fs.mkdirSync(currentdir);	
			}catch(e){
				console.error(e);
			}
		}
	});
	return Promise.resolve();
}

const runPredictionRec = (index, predictionLibs, input)=>{
	if(index < predictionLibs.length){
		return predictionLibs[index].predict([input])
		.then((outputs)=>{
			index++;
			return runPredictionRec(index, predictionLibs, outputs[0]);
		});
	}
	return input;
}

const runPrediction = (inputFileName, predictionLibs, outputFileName, out_spc)=>{
	
	try{
		console.log("Reading:", inputFileName)
		
		var medimgreader = new MedImgReader();
		medimgreader.SetFilename(fs.realpathSync(inputFileName));
		medimgreader.ReadImage();
		var in_img = medimgreader.GetOutput();
		medimgreader.delete();

		return Promise.bind({})
		.then(()=>{
			const self = this;
			var index = 0;

			return runPredictionRec(index, predictionLibs, in_img)
			.then((output)=>{
				var plib = predictionLibs[predictionLibs.length - 1];
				var labels = plib.getModelDescription().labels? plib.getModelDescription().labels: undefined;
				return {
					type: plib.getModelDescription().outputs[0].type,
					output,
					labels
				}
			});
			
		})
		.then((final_output)=>{
			if(final_output.type == "image"){
				if(outputFileName){
					console.log("Writing:", outputFileName);
					const writer = new MedImgReader();
					writer.SetFilename(outputFileName);
					if(out_spc){
						final_output.output.spacing = out_spc;
					}
					writer.SetInput(final_output.output)
					writer.WriteImage();
					writer.delete();
				}
				return final_output;
			}else if(final_output.type == "array"){
				var obj = _.object(final_output.labels, final_output.output);
				obj["class"] = final_output.labels[_.indexOf(final_output.output, _.max(final_output.output))];
				obj["img"] = inputFileName;
				return obj;
			}else{
				return final_output;
			}
		})
		.then((final_output)=>{
			return final_output;
		})
		.catch((e)=>{
			console.error(e)
			return Promise.resolve(null);
		})
	}catch(e){
		console.error(e);
		return Promise.resolve(null);
	}
	
	
}

var img = argv["img"];
var dirname = argv["dir"];
var predictionType = argv["type"]? argv["type"] : ["remove_calipers"];
var out = argv["out"]? argv["out"] : "out.nrrd";
var out_spc = argv["out_spc"];
if(out_spc){
	out_spc = out_spc.split(",").map(Number);
}

Promise.resolve((()=>{
	if(dirname){
		return readDir(dirname)
		.then((filenames)=>{
			if(path.extname(out) == ""){
				return Promise.map(filenames, (img)=>{
					var outpath = path.normalize(img.replace(dirname, out + path.sep));
					outpath = outpath.replace(path.extname(outpath), ".nrrd");
					return mkdirp(path.dirname(outpath))
					.then(()=>{
						return {img, out: outpath};
					})
				})	
			}
			return _.map(filenames, (img)=>{return {img}});
		});
	}else{
		return [{img, out}];	
	}
})())
.then((fobjs)=>{
	if(!_.isArray(predictionType)){
		predictionType = [predictionType];
	}
	return Promise.map(predictionType, (pt)=>{
		const classPrediction = new RunPredictionLib();
		classPrediction.setPredictionType(pt);
		return classPrediction;
	}, {concurrency: 1})
	.then((predictionLibs)=>{
		return Promise.map(fobjs, (fobj)=>{
			return runPrediction(fobj.img, predictionLibs, fobj.out, out_spc);	
		}, {concurrency: 1});	
	});
})
.then((predictions)=>{
	if(out && path.extname(out) == ".csv"){
		console.log("Writing:", out);
		return writeCSV(out, _.compact(_.flatten(predictions)));
	}
})
.catch((e)=>{
	console.error(e);
})

