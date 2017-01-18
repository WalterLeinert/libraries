var webpack = require('webpack');
var path = require('path');
var failPlugin = require('webpack-fail-plugin');

module.exports = {
  // context: path.join(__dirname, '.'),
  entry: {
    main: './src/index'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: "commonjs"
  },
  resolve: {
    extensions: ['', '.ts', '.js'],
    modules: [
      //'node_modules',
      //path.join(__dirname, 'src'),
    ]
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,

        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'ts',
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
    'ts-httpexceptions'
  ],
}