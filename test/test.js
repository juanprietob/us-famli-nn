const readImageLocalFileSync = require('itk/readImageLocalFileSync');
const writeImageLocalFileSync = require('itk/writeImageLocalFileSync');
const Lab = require('@hapi/lab');
const lab = exports.lab = Lab.script();
const path = require('path');
const RunPredictionLib = require(path.join(__dirname, '..'));
const _ = require('underscore');

lab.experiment("Test nn-prediction-lib", function(){
	

    lab.test('returns true when an image is predicted', function(){

        var inputFileName = path.join(__dirname, 'us1.nrrd');
		var outputFileName = path.join(__dirname, 'us1_out.nrrd');
		const in_img = readImageLocalFileSync(inputFileName);
		
		const prediction = new RunPredictionLib();
		prediction.setInput(in_img);
		prediction.setPredictionType('remove_calipers');
		return prediction.predict()
		.then(function(outputs){
			_.each(outputs, function(output){
				if(output.name == "Image"){
					writeImageLocalFileSync(true, output, outputFileName);	
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


})