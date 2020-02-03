import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';

module.exports = {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    name: 'us-famli-nn'
  },
  plugins: [
  	json(),
  	alias({
  		entries: {
  			'tfjs': '@tensorflow/tfjs-node'
  		}
  	})
  ]
};