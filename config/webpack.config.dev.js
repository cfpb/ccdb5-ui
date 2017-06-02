'use strict';

var merge = require('webpack-merge');
var baseConfig = require('../config/webpack-config-base');

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
var WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
var getClientEnvironment = require('./env');
var paths = require('./paths');



var publicUrl = '';
var env = getClientEnvironment(publicUrl);

module.exports = merge({
  devtool: 'cheap-module-source-map',
  entry: [
    require.resolve('react-dev-utils/webpackHotDevClient')
  ],  
  output: {
    pathinfo: true,
    publicPath: '/',
    filename: 'ccdb5.js'
  },
  module: {
    loaders: [      
      {
        exclude: [
          /\.html$/,
          // We have to write /\.(js|jsx)(\?.*)?$/ rather than just /\.(js|jsx)$/
          // because you might change the hot reloading server from the custom one
          // to Webpack's built-in webpack-dev-server/client?/, which would not
          // get properly excluded by /\.(js|jsx)$/ because of the query string.
          // Webpack 2 fixes this, but for now we include this hack.
          // https://github.com/facebookincubator/create-react-app/issues/1713
          /\.(js|jsx)(\?.*)?$/,
          /\.css$/,
          /\.json$/,
          /\.svg$/,
          /\.less$/
        ],
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/media/[name].[ext]'
        }
      },
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: 'babel',
        query: {
          
          cacheDirectory: true
        }
      },
      {
        test: /\.css$/,
        loader: 'style!css?importLoaders=1!postcss'
      }
    ]
  },
  plugins: [
    new InterpolateHtmlPlugin(env.raw),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    new webpack.DefinePlugin(env.stringified),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules)
  ]
}, baseConfig);
