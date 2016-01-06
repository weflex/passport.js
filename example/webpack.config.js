"use strict";

module.exports = {
  entry: ['babel-polyfill', './index.js'],
  output: {
    path: './',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-1']
        }
      }
    ]
  },
};