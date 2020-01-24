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

const help = function(){
    console.error("Help: Run prediction in the ultrasound images");
    console.error("Required:");
    console.error("--dir <directory>")
    console.error("--img <input path to image>");
    console.error("--type <prediction type (accepted multiple types to concatenate the predictions)>");
    console.error("--out <output filename>");
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
	const self = this;
	return Promise.resolve(_.compact(_.flatten(_.map(fs.readdirSync(dirname), function(filename){
	  var full_path = path.join(dirname, filename);
	  var stats = fs.statSync(full_path);
	  if(stats.isDirectory()){
	    return _.flatten(self.readDir(full_path));
	  }else{
	  	var ext = path.extname(full_path);
	  	if(ext.match(new RegExp(/nrrd|nii|gz|dcm|jpg|png|mhd/))){
	  		return full_path;
	  	}
	  }
	}))));
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

const runPrediction = (inputFileName, predictionType, outputFileName)=>{
	const medimgreader = new MedImgReader();
	medimgreader.SetFilename(inputFileName);
	medimgreader.ReadImage();
	var in_img = medimgreader.GetOutput();

	var imgpad = new ImgPadResampleLib();
	imgpad.SetImage(in_img);
	imgpad.SetOutputSize([1000, 750]);
	imgpad.SetFitSpacingToOutputSizeOn();
	imgpad.SetIsoSpacingOn();

	imgpad.Update();
	var img_out = imgpad.GetOutput();

	if(!_.isArray(predictionType)){
		predictionType = [predictionType];
	}

	return Promise
	.bind({})
	.then(()=>{
		const self = this;
		self.outputs = [img_out]
		return Promise.map(predictionType, (pt, index)=>{
			var classPrediction = new RunPredictionLib();
			classPrediction.setPredictionType(pt);
			classPrediction.setInput(self.outputs[index]);
			return classPrediction.predict()
			.then((outputs)=>{
				self.outputs.push(outputs[0]);
				var labels = classPrediction.getModelDescription().labels? classPrediction.getModelDescription().labels: undefined;
				return {
					type: classPrediction.getModelDescription().outputs[0].type,
					output: outputs[0],
					labels
				};
			});
		}, {concurrency: 1})
	})
	.then((outputs)=>{	
		var final_output = outputs[outputs.length - 1];
		if(final_output.type == "image"){
			if(outputFileName){
				console.log("Writing:", outputFileName);
				const writer = new MedImgReader();
				writer.SetFilename(outputFileName);
				writer.SetInput(final_output.output)
				writer.WriteImage();
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
	.catch((e)=>{
		console.error(e)
	})	
}

var img = argv["img"];
var dirname = argv["dir"];
var predictionType = argv["type"]? argv["type"] : ["remove_calipers"];
var out = argv["out"]? argv["out"] : "out.nrrd";

Promise.resolve((()=>{
	if(dirname){
		return readDir(dirname)
		.then((filenames)=>{
			if(path.extname(out) == ""){
				return Promise.map(filenames, (img)=>{
					var outpath = path.normalize(img.replace(dirname, out + path.sep));
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
	return Promise.map(fobjs, (fobj)=>{
		return runPrediction(fobj.img, predictionType, fobj.out);	
	}, {concurrency: 1});
})
.then((predictions)=>{
	if(out && path.extname(out) == ".csv"){
		console.log("Writing:", out);
		return writeCSV(out, predictions);
	}
})
.catch((e)=>{
	console.error(e);
})

