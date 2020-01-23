#!/usr/bin/env node

const MedImgReader = require('med-img-reader');
const ImgPadResampleLib = require('itk-image-pad-resample');
const RunPredictionLib = require('..');
const argv = require('minimist')(process.argv.slice(2));
const _ = require('underscore');
const fs = require('fs');

const help = function(){
    console.error("Help: Run prediction in the ultrasound images");
    console.error("Required:");
    console.error("--img <input path to image>");
    console.error("--type <prediction type>");
    console.error("--out <output filename>");
}

if(argv["h"] || argv["help"] || !argv["img"]){
    help();
    process.exit(1);
}

var inputFileName = argv["img"];
var predictionType = argv["type"]? argv["type"] : "remove_calipers";
var outputFileName = argv["out"]? argv["out"] : "out.nrrd";

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

var classPrediction = new RunPredictionLib();
classPrediction.setPredictionType(predictionType);
classPrediction.setInput(img_out);
classPrediction.predict()
.then((outputs)=>{
	_.each(outputs, (o, i)=>{
		if(classPrediction.getModelDescription().outputs[i].type == "image"){
			console.log("Writing:", outputFileName);
			const writer = new MedImgReader();
			writer.SetFilename(outputFileName);
			writer.SetInput(o)
			writer.WriteImage();		
		}else{
			console.log("Writing:", outputFileName);
			fs.writeFileSync(outputFileName, o.toString());
		}
	});
});