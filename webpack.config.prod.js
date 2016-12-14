var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var webpackMd5Hash = require('webpack-md5-hash');
var package = require('./package');

module.exports = {

  context: __dirname + '/app',

  entry: {
    app: './index.js'
  },

  output: {
    path: 'dist',
    publicPath : '/',
    filename: '[name].[chunkhash].js'
  },

  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loaders: ['babel'],
      include: path.join(__dirname, './app')
    },{
      test: /\.s?css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
    }]
  },

  plugins: [
    new webpack.DefinePlugin({
      // A common mistake is not stringifying the "production" string.
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpackMd5Hash(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: '[name].[chunkhash].js',
      minChunks: Infinity
    }),
    new ExtractTextPlugin('style.[contenthash].css', { allChunks: true }),

    new HtmlWebpackPlugin({
      title: 'overwatch-select',
      filename: 'index.html',
      template: 'index.html'
    })
  ]

};
