"use strict";

module.exports = {
  entry: './passport.js',
  output: {
    path: './dist',
    filename: 'passport.js'
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