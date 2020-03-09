(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('itk/ImageType'), require('itk/Image'), require('itk/Matrix'), require('itk/PixelTypes')) :
	typeof define === 'function' && define.amd ? define(['itk/ImageType', 'itk/Image', 'itk/Matrix', 'itk/PixelTypes'], factory) :
	(global = global || self, global['us-famli-nn'] = factory(global.ImageType, global.Image, global.Matrix, global.PixelTypes));
}(this, (function (ImageType, Image, Matrix, PixelTypes) { 'use strict';

	ImageType = ImageType && ImageType.hasOwnProperty('default') ? ImageType['default'] : ImageType;
	Image = Image && Image.hasOwnProperty('default') ? Image['default'] : Image;
	Matrix = Matrix && Matrix.hasOwnProperty('default') ? Matrix['default'] : Matrix;
	PixelTypes = PixelTypes && PixelTypes.hasOwnProperty('default') ? PixelTypes['default'] : PixelTypes;

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
		remove_calipers: remove_calipers,
		"US-famli-flat-nrrd-cleaned_ga_only_64_AC_encoder": {
		type: "image",
		description: "Encode images for abdominal space",
		inputs: [
			{
				type: "image",
				size: [
					64,
					64
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
	},
		"US-famli-flat-nrrd-cleaned_ga_only_64_AC_generator": {
		type: "image",
		description: "Generate images for abdominal space",
		inputs: [
			{
				type: "image",
				size: [
					1,
					1
				],
				components: 128
			}
		],
		outputs: [
			{
				type: "image"
			}
		]
	},
		"US-famli-flat-nrrd-cleaned_ga_only_64_BPD_encoder": {
		type: "image",
		description: "Encode images for abdominal space",
		inputs: [
			{
				type: "image",
				size: [
					64,
					64
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
	},
		"US-famli-flat-nrrd-cleaned_ga_only_64_BPD_generator": {
		type: "image",
		description: "Generate images for abdominal space",
		inputs: [
			{
				type: "image",
				size: [
					1,
					1
				],
				components: 128
			}
		],
		outputs: [
			{
				type: "image"
			}
		]
	},
		"US-famli-flat-nrrd-cleaned_ga_only_64_FL_encoder": {
		type: "image",
		description: "Encode images for abdominal space",
		inputs: [
			{
				type: "image",
				size: [
					64,
					64
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
	},
		"US-famli-flat-nrrd-cleaned_ga_only_64_FL_generator": {
		type: "image",
		description: "Generate images for femur space",
		inputs: [
			{
				type: "image",
				size: [
					1,
					1
				],
				components: 128
			}
		],
		outputs: [
			{
				type: "image"
			}
		]
	},
		"US-famli-flat-nrrd-cleaned_ga_only_64_CRL_encoder": {
		type: "image",
		description: "Encode images for crown rump length space",
		inputs: [
			{
				type: "image",
				size: [
					64,
					64
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
	},
		"US-famli-flat-nrrd-cleaned_ga_only_64_CRL_generator": {
		type: "image",
		description: "Generate images for crown rump length space",
		inputs: [
			{
				type: "image",
				size: [
					1,
					1
				],
				components: 128
			}
		],
		outputs: [
			{
				type: "image"
			}
		]
	},
		"US-famli-flat-nrrd-cleaned_ga_only_high_res_resunet_64_512": {
		type: "image",
		description: "Generate high res images 64x64 -> 512x512",
		inputs: [
			{
				type: "image",
				size: [
					512,
					512
				],
				components: 1,
				rescale: [
					0,
					255
				]
			}
		],
		outputs: [
			{
				type: "image"
			}
		]
	}
	};

	// const ImageType = require('itk/ImageType');

	const _ = require('underscore');
	const path = require('path');
	const Promise = require('bluebird');
	const ImgPadResampleLib = require('itk-image-pad-resample');
	// try{
		// const tf = require('@tensorflow/tfjs-node-gpu');	
	// }catch(e){
		// console.log(e)
		const tf = require('@tensorflow/tfjs-node');	
	// }


	class USFamliLib {
		constructor(){
			this.models = ModelsDescription;
			this.loadedModels = {};
			this.predictionType = '';
			this.image_reference = undefined;
		}
		setImageReference(image_reference){
			this.image_reference = image_reference;
		}
		getImageReference(){
			return this.image_reference;
		}
		getModelDescription(){
			if(this.predictionType){
				return this.models[this.predictionType];
			}else{
				return {};
			}
		}
		getPredictionType(){
			return this.predictionType;
		}
		setPredictionType(prediction_type){
			this.predictionType = prediction_type;
		}
		loadSavedModel(prediction_type){
			const self = this;
			if(self.loadedModels[prediction_type]){
				return Promise.resolve({model: self.loadedModels[prediction_type], model_description: self.models[prediction_type]});
			}
			var model_path = path.join(__dirname, '../models', prediction_type);
			console.log("Loading:", model_path);
			return tf.node.loadSavedModel(model_path)
			.then(function(model){
				self.loadedModels[prediction_type] = model;
				return Promise.resolve({model, model_description: self.models[prediction_type]});	
			});	
			
		}
		tensorToImage(tf_tensor){
			
			var size = [...tf_tensor.shape];
			var num_components = size.pop();
			if(size.length == 0){
				size = [1,1];
			}
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
					return self.tensorToImage(u.reshape([...u.shape, 1]))
					.then((out_img)=>{
						out_img.origin = in_img.origin;
						out_img.spacing = in_img.spacing;
						out_img.direction = in_img.direction;
						return out_img;
					});
				});
			})
			.then(function(u){
				return _.flatten(u);
			})
		}
		getTf(){
			return tf;
		}
		checkComponents(tf_img, num_components){
			var shape = tf_img.shape;
			if(shape[shape.length - 1] != num_components){
				var unstack = tf_img.unstack(shape.length - 1);
				return tf.stack(_.compact(_.map(unstack, (un, i)=>{return i < num_components? un : null;})), -1)
			}
			return tf_img;
		}
		checkInputs(inputs, inputs_description){
			const self = this;
			return Promise.all(_.map(inputs_description, function(description, index){
				var input = inputs[index];
				if(description.type == "image"){
					if(_.isEqual(input.size, description.size)){
						return input;
					}else{
						return self.resampleImage(input, description.size, description.linear_interpolation);
					}
				}
				return Promise.reject({"error": "Description type not supported", description});
			}))
		}
		checkOutputs(inputs, outputs_description, y){
			const self = this;
			return Promise.map(outputs_description, (description, index)=>{
				if(description.type == "image"){
					return self.tensorToImage(y)
					.then((out_img)=>{
						var image_reference = self.getImageReference();
						image_reference = image_reference? image_reference : inputs[index];
						if(image_reference && image_reference.imageType && image_reference.imageType.dimension == out_img.imageType.dimension){
							const in_img = image_reference;
							out_img.origin = in_img.origin;
							out_img.spacing = _.map(in_img.spacing, (s, i)=>{
								if(out_img.size[i] && out_img.size[i] > 0){
									return (in_img.size[i]*s)/out_img.size[i];	
								}
								return s;
							});
							out_img.direction = in_img.direction;
							return out_img;
						}
						return out_img;
					});
				}else if(description.type == "tensor"){
					return y;
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
			var img_out = imgpad.GetOutput();
			imgpad.delete();
			return Promise.resolve(img_out);
		}
		predict(inputs){
			const self = this;
			tf.engine().startScope();
			return self.loadSavedModel(self.predictionType)
			.then(function(m){
				return self.checkInputs(inputs, m.model_description.inputs)
				.then((inputs)=>{
					return Promise.all(_.map(m.model_description.inputs, function(description, index){
						var input = inputs[index];
						return self.imageToTensor(input)
						.then((tf_img)=>{return self.checkComponents(tf_img, description.components)})
						.then((tf_img)=>{
							if(description.rescale){
								return tf_img.sub(tf_img.min()).div(tf_img.max().sub(tf_img.min())).mul(description.rescale[1] - description.rescale[0]).add(description.rescale[0])
							}
							return tf_img;
						});	
					}))
					.then(function(x){
						x = x[0];
						x = x.reshape([1, ...x.shape]);
						var y = m.model.predict(x);
						return self.checkOutputs(inputs, m.model_description.outputs, y.reshape(y.shape.slice(1)))
						.then((outputs)=>{tf.engine().endScope(); return outputs;});
					});
				})
			})
		}
		zeros(shape){
			return tf.zeros(shape);
		}
	}

	return USFamliLib;

})));
