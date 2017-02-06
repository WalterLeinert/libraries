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
    filename: 'common.bundle.js',
    libraryTarget: "commonjs"
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      path.join(__dirname, 'src'),
      'node_modules',
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
    'dashdash',
    'moment',
    'reflect-metadata',
    'rxjs',
    /rxjs\/*/
  ],
}