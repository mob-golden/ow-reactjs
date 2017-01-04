var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {

  context: __dirname + '/app',

  entry: {
    app: './index.js',
  },

  output: {
    filename: 'app.js',
    publicPath : '/',
    path: __dirname + '/dist'
  },

  devtool: '#sourcemap',

  // For enabling page refreshes in development
  devServer: {
    contentBase: __dirname + '/dist',
  },

  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loaders: ['react-hot-loader/webpack', 'babel'],
      include: path.join(__dirname, './app')
    },{
      test: /\.s?css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader')
    },{
      test: /\.svg(\?.*)$/,
      loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml'
    }]
  },

  plugins: [
    new ExtractTextPlugin('style.[contenthash].css', { allChunks: true }),
    new CopyWebpackPlugin([
      { from: __dirname + '/app/google.js', to: 'app/' }
    ]),
    new HtmlWebpackPlugin({
      title: 'overwatch-select',
      filename: 'index.html',
      template: 'index.html'
    })
  ],
  resolve: {
    alias: { 'react/lib/ReactMount': 'react-dom/lib/ReactMount'
  }
}

}
