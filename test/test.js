const MedImgReader = require('med-img-reader');
const Lab = require('@hapi/lab');
const lab = exports.lab = Lab.script();
const path = require('path');
const RunPredictionLib = require(path.join(__dirname, '..'));
const _ = require('underscore');

lab.experiment("Test nn-prediction-lib", function(){
	

    lab.test('returns true when an image is predicted', function(){

        var inputFileName = path.join(__dirname, 'us1.nrrd');
		var outputFileName = path.join(__dirname, 'us1_out.nrrd');
		const medImgReader = new MedImgReader();
		medImgReader.SetFilename(inputFileName);
		medImgReader.ReadImage();
		const in_img = medImgReader.GetOutput();
		
		const prediction = new RunPredictionLib();
		prediction.setInput(in_img);
		prediction.setPredictionType('remove_calipers');
		return prediction.predict()
		.then(function(outputs){
			_.each(outputs, function(output){
				if(output.name == "Image"){
					const writer = new MedImgReader();
					writer.SetFilename(outputFileName);
					writer.SetInput(output);
					writer.WriteImage();
				}
			})
			_.each(outputs, function(output){
				if(output.name == "Image"){
					const prediction = new RunPredictionLib();
					prediction.setInput(output);
					prediction.setPredictionType('classify_ga');
				}
			})
		});
        
    });

  	lab.test('returns true when an image is predicted', function(){

        var inputFileName = path.join(__dirname, 'us1.nrrd');
		var outputFileName = path.join(__dirname, 'us1_out.nrrd');
		const medImgReader = new MedImgReader();
		medImgReader.SetFilename(inputFileName);
		medImgReader.ReadImage();
		const in_img = medImgReader.GetOutput();
		
		const prediction = new RunPredictionLib();
		prediction.setInput(in_img);
		prediction.setPredictionType('classify_ga_block4');
		return prediction.predict()
		.then(function(outputs){
			_.each(outputs, function(output){
				if(output.name == "Image"){
					const writer = new MedImgReader();
					writer.SetFilename(outputFileName);
					writer.SetInput(output);
					writer.WriteImage();
				}
			})
			return true;
		});
        
    });


})