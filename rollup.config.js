import json from '@rollup/plugin-json';

module.exports = {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    name: 'us-famli-nn'
  },
  plugins: [ json() ]
};