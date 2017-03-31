var webpack = require('webpack');
var path = require('path');
var failPlugin = require('webpack-fail-plugin');

module.exports = {
  context: path.join(__dirname, '.'),
  entry: {
    index: './src/index'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'client.bundle.js',
    libraryTarget: "commonjs"
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      //'node_modules',
      path.join(__dirname, 'src'),
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
    '@angular/common',
    '@angular/core',
    '@angular/forms',
    '@angular/http',
    '@angular/platform-browser',
    '@angular/router',
    '@fluxgate/common',
    '@types/http-status-codes',
    'http-status-codes',
    'moment',
    'tinycolor2',
    /^primeng\/*/,
    'rxjs',
    /rxjs\/*/
  ],
}