'use strict';

var paths = require('./paths');
var autoprefixer = require('autoprefixer');

module.exports = {
  entry: [
    require.resolve('./polyfills'),
    paths.appIndexJs
  ],  
  output: {
    path: paths.appBuild,
    library: 'ccdb5_ui'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'capital-framework': undefined
  },
  resolve: {
    fallback: paths.nodePaths,
    extensions: ['.js', '.json', '.jsx', ''],
    alias: {
      'react-native': 'react-native-web'
    }
  },
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint',
        include: paths.appSrc
      }
    ],
    loaders: [
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.svg$/,
        loader: 'file',
        query: {
          name: 'static/media/[name].[ext]'
        }
      },
      {
        test: /\.less$/,
        loader: 'style!css!less'
      }
    ]
  },
  postcss: function() {
    return [
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
        ]
      }),
    ];
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }  
}