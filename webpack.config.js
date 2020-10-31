const path = require('path');

module.exports = {
  entry: [
    './js/debounce.js',
    './js/render.js',
    './js/backend.js',
    './js/card.js',
    './js/map.js',
    './js/pin.js',
    './js/form.js'
  ],

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'js'),
    iife: true
  },
  devtool: false
};
