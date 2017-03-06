var webpack = require('webpack');
var merge = require('webpack-merge');
var path = require('path');
var failPlugin = require('webpack-fail-plugin');

const PLATFORM = process.env.PLATFORM_ENV = process.env.PLATFORM = 'node';

var defaults = {
  context: path.join(__dirname, '.'),
  entry: path.join(__dirname, './src/index'),
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
    'core-decorators',
    'dashdash',
    'left-pad',
    'log4js',
    'moment',
    'object.entries',
    'tinycolor2',
    'reflect-metadata',
    'rxjs',
    /rxjs\/*/
  ],
};


var clientConfig = merge(defaults, {
  target: 'web',

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'common.client.bundle.js',
    libraryTarget: "commonjs"
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'PLATFORM': JSON.stringify('web')
      }
    })
  ]

});


var serverConfig = merge(defaults, {
  target: 'node',

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'common.node.bundle.js',
    libraryTarget: "commonjs"
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'PLATFORM': JSON.stringify('node')
      }
    })
  ]

});



module.exports = [clientConfig, serverConfig];

