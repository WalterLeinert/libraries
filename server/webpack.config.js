var webpack = require('webpack');
var path = require('path');
var failPlugin = require('webpack-fail-plugin');

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: path.join(__dirname, './src/index'),

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'server.bundle.js',
    libraryTarget: "commonjs"
  },

  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      path.join(__dirname, 'src'),
      'node_modules'
    ]
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,

        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'ts-loader',
        exclude: [
          /node_modules/,
          /dts/
        ]
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
    'ts-httpexceptions',
    'ts-log-debug'
  ],
}