(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('bluebird'), require('underscore'), require('itk-image-pad-resample'), require('itk/ImageType'), require('itk/Image'), require('itk/Matrix'), require('itk/PixelTypes'), require('@tensorflow/tfjs-node'), require('path')) :
	typeof define === 'function' && define.amd ? define(['bluebird', 'underscore', 'itk-image-pad-resample', 'itk/ImageType', 'itk/Image', 'itk/Matrix', 'itk/PixelTypes', '@tensorflow/tfjs-node', 'path'], factory) :
	(global = global || self, global['us-famli-nn'] = factory(global.Promise, global._, global.ImgPadResampleLib, global.ImageType, global.Image, global.Matrix, global.PixelTypes, global.tf, global.path));
}(this, (function (Promise, _, ImgPadResampleLib, ImageType, Image, Matrix, PixelTypes, tf, path) { 'use strict';

	Promise = Promise && Promise.hasOwnProperty('default') ? Promise['default'] : Promise;
	_ = _ && _.hasOwnProperty('default') ? _['default'] : _;
	ImgPadResampleLib = ImgPadResampleLib && ImgPadResampleLib.hasOwnProperty('default') ? ImgPadResampleLib['default'] : ImgPadResampleLib;
	ImageType = ImageType && ImageType.hasOwnProperty('default') ? ImageType['default'] : ImageType;
	Image = Image && Image.hasOwnProperty('default') ? Image['default'] : Image;
	Matrix = Matrix && Matrix.hasOwnProperty('default') ? Matrix['default'] : Matrix;
	PixelTypes = PixelTypes && PixelTypes.hasOwnProperty('default') ? PixelTypes['default'] : PixelTypes;
	tf = tf && tf.hasOwnProperty('default') ? tf['default'] : tf;
	path = path && path.hasOwnProperty('default') ? path['default'] : path;

	var classify_ga = {
		type: "class",
		description: "Classify images with fetal structures usable for biometry measurement and gestational age prediction. Returns array with probabilities",
		inputs: [
			{
				type: "image",
				size: [
					1000,
					750
				],
				components: 1,
				linear_interpolation: true
			}
		],
		outputs: [
			{
				type: "array"
			}
		],
		labels: [
			"head",
			"fetus",
			"femur",
			"abdomen"
		],
		responses: [
			"classify_ga_block0",
			"classify_ga_block1",
			"classify_ga_block2",
			"classify_ga_block3",
			"classify_ga_block4",
			"classify_ga_fc"
		]
	};
	var classify_ga_block0 = {
		type: "image",
		inputs: [
			{
				type: "image",
				size: [
					1000,
					750
				],
				components: 1
			}
		],
		outputs: [
			{
				type: "image"
			}
		]
	};
	var classify_ga_block1 = {
		type: "image",
		inputs: [
			{
				type: "image",
				size: [
					1000,
					750
				],
				components: 1
			}
		],
		outputs: [
			{
				type: "image"
			}
		]
	};
	var classify_ga_block2 = {
		type: "image",
		inputs: [
			{
				type: "image",
				size: [
					1000,
					750
				],
				components: 1
			}
		],
		outputs: [
			{
				type: "image"
			}
		]
	};
	var classify_ga_block3 = {
		type: "image",
		inputs: [
			{
				type: "image",
				size: [
					1000,
					750
				],
				components: 1
			}
		],
		outputs: [
			{
				type: "image"
			}
		]
	};
	var classify_ga_block4 = {
		type: "image",
		inputs: [
			{
				type: "image",
				size: [
					1000,
					750
				],
				components: 1
			}
		],
		outputs: [
			{
				type: "image"
			}
		]
	};
	var classify_ga_fc = {
		type: "image",
		inputs: [
			{
				type: "image",
				size: [
					1000,
					750
				],
				components: 1
			}
		],
		outputs: [
			{
				type: "image"
			}
		]
	};
	var remove_calipers = {
		type: "image",
		description: "Remove the calipers and text from an ultrasound image. Keeps the ultrasound only",
		inputs: [
			{
				type: "image",
				size: [
					1000,
					750
				],
				components: 1,
				linear_interpolation: true
			}
		],
		outputs: [
			{
				type: "image"
			}
		]
	};
	var ModelsDescription = {
		classify_ga: classify_ga,
		classify_ga_block0: classify_ga_block0,
		classify_ga_block1: classify_ga_block1,
		classify_ga_block2: classify_ga_block2,
		classify_ga_block3: classify_ga_block3,
		classify_ga_block4: classify_ga_block4,
		classify_ga_fc: classify_ga_fc,
		remove_calipers: remove_calipers
	};

	class USFamliLib {
		constructor(){
			this.models = ModelsDescription;
			this.loadedModels = {};
			this.inputs = [];
			this.predictionType = '';
		}
		getModelDescription(){
			if(this.predictionType){
				return this.models[this.predictionType];
			}else{
				return {};
			}
		}
		addInput(input){
			this.inputs.push_back(input);
		}
		setInput(input){
			if(this.inputs.length == 0){
				this.inputs.push(input);
			}else{
				this.inputs[0] = input;	
			}
		}
		setPredictionType(prediction_type){
			this.predictionType = prediction_type;
		}
		loadSavedModel(prediction_type){
			const self = this;
			if(self.loadedModels[prediction_type]){
				return Promise.resolve({model: self.loadedModels[prediction_type], model_description: self.models[prediction_type]});
			}
			
			var model_path = path.join(__dirname, '../models', prediction_type + "_saved_model");
			return tf.node.loadSavedModel(model_path)
			.then(function(model){
				self.loadedModels[prediction_type] = model;
				return Promise.resolve({model, model_description: self.models[prediction_type]});	
			});	
			
		}
		tensorToImage(tf_tensor){
			
			var size = [...tf_tensor.shape];
			var num_components = size.pop();
			var dimension = size.length;

			var pixelType = PixelTypes.Scalar;
			if(num_components > 1){
				pixelType = PixelTypes.Vector;
			}
			var out_img = new Image(new ImageType(dimension, 'float', pixelType, num_components));
			out_img.origin = Array(dimension).fill(0);
			out_img.spacing = Array(dimension).fill(1);
			out_img.direction = new Matrix(dimension, dimension);
			out_img.direction.setIdentity();
			out_img.size = size;
			out_img.size.reverse();
			
			return tf_tensor.buffer()
			.then((buf)=>{
				out_img.data = buf.values;
				return out_img;
			})
		}
		imageToTensor(in_img){
			return Promise.resolve(tf.tensor(Float32Array.from(in_img.data), [...[...in_img.size].reverse(), in_img.imageType.components]));
		}
		unstackImageComponents(in_img){
			const self = this;
			return self.imageToTensor(in_img)
			.then((tf_img)=>{
				var unstack = tf_img.unstack(tf_img.shape.length - 1);
				return Promise.map(unstack, (u)=>{
					return self.tensorToImage(u.reshape([...u.shape, 1]));
				});
			})
			.then(function(u){
				return _.flatten(u);
			})
		}
		checkComponents(tf_img, num_components){
			var shape = tf_img.shape;
			if(shape[shape.length - 1] != num_components){
				var unstack = tf_img.unstack(shape.length - 1);
				return tf.stack(_.compact(_.map(unstack, (un, i)=>{return i < num_components? un : null;})), -1)
			}
			return tf_img;
		}
		checkInputs(inputs_description){
			const self = this;
			return Promise.all(_.map(inputs_description, function(description, index){
				var input = self.inputs[index];
				if(description.type == "image"){
					if(_.isEqual(input.size, description.size)){
						return self.imageToTensor(input)
						.then((tf_img)=>{return self.checkComponents(tf_img, description.components)});
					}else{
						return self.resampleImage(input, description.size, description.linear_interpolation)
						.then((res_img)=>{return self.imageToTensor(res_img)})
						.then((tf_img)=>{return self.checkComponents(tf_img, description.components)});
					}
				}
				return Promise.reject({"error": "Description type not supported", description});
			}))
		}
		checkOutputs(outputs_description, y){
			const self = this;
			return Promise.map(outputs_description, (description, index)=>{
				if(description.type == "image"){
					return self.tensorToImage(y)
					.then((out_img)=>{
						if(self.inputs[index] && self.inputs[index].imageType && self.inputs[index].imageType.dimension == out_img.imageType.dimension){
							const in_img = self.inputs[index];
							out_img.origin = in_img.origin;
							out_img.spacing = in_img.spacing;
							out_img.direction = in_img.direction;
							return out_img;
						}
						return out_img;
					});
				}else{
					return y.buffer()
					.then((buf)=>{
						return buf.values;
					});
				}
			})
			
		}
		resampleImage(in_img, output_size, linear_interpolation){
			
			var imgpad = new ImgPadResampleLib();
			imgpad.SetImage(in_img);
			imgpad.SetOutputSize(output_size);
			imgpad.SetFitSpacingToOutputSizeOn();
			imgpad.SetIsoSpacingOn();
			if(linear_interpolation){
				imgpad.SetInterpolationTypeToLinear();	
			}
			imgpad.Update();
			return Promise.resolve(imgpad.GetOutput());
		}
		predict(){
			const self = this;
			return self.loadSavedModel(self.predictionType)
			.then(function(m){
				return self.checkInputs(m.model_description.inputs)
				.then(function(x){
					x = x[0];
					x = x.reshape([1, ...x.shape]);
					var y = m.model.predict(x);
					return self.checkOutputs(m.model_description.outputs, y.reshape(y.shape.slice(1)));
				})
			})
		}
	}

	return USFamliLib;

})));