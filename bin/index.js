#!/usr/bin/env node

const MedImgReader = require('med-img-reader');
const ImgPadResampleLib = require('itk-image-pad-resample');
const argv = require('minimist')(process.argv.slice(2));
const _ = require('underscore');

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



// console.log("Writing:", outputFileName);

// const writer = new MedImgReader();
// writer.SetFilename(outputFileName);
// writer.SetInput(img_out)
// writer.WriteImage();