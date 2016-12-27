var webpack = require('webpack');
var path = require('path');
var failPlugin = require('webpack-fail-plugin');

module.exports = {
  context: __dirname + '/src',
  entry: {
    index: './index'
  },
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    libraryTarget: "commonjs"
  },
  resolve: {
    root: __dirname,
    // Add `.ts` as a resolvable extension.
    extensions: ['', '.ts', '.js'],
    modules: [
      'node_modules',
      'src',
    ]
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },

  devtool: "source-map",

  target: 'node', // important in order not to bundle built-in modules like path, fs, etc. 
  externals: [
    '@fluxgate/common',
    'enter-exit-logger',
    'express',
    'js-shortid',
    'knex', 
    'log4js',
    'moment',
    'mysql',
    'passport',
    'passport-local',
    'reflect-metadata',
    'ts-express-decorators',
    'ts-httpexceptions'
  ],
}