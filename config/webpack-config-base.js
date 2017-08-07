var paths = require( './paths' );
var autoprefixer = require( 'autoprefixer' );

module.exports = {
  entry: [
    require.resolve( './polyfills' ),
    paths.appIndexJs
  ],
  output: {
    filename: 'ccdb5.min.js',
    path: paths.appBuild,
    library: 'ccdb5_ui'
  },
  externals: {
    'capital-framework': undefined
  },
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We read `NODE_PATH` environment variable in `paths.js` and pass paths here.
    // We use `fallback` instead of `root` because we want `node_modules` to "win"
    // if there any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    fallback: paths.nodePaths,
    extensions: [ '.js', '.json', '.jsx', '' ],
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
      { test: /\.svg$/, loader: 'ignore-loader' },
      {
        test: /\.less$/,
        loader: 'style!css!less'
      },
      // make sure the `React` global variable is available
      {
        test: require.resolve( 'react' ),
        loader: 'expose-loader?React'
      },
      // make sure the `ReactDOM` global variable is available
      {
        test: require.resolve( 'react-dom' ),
        loader: 'expose-loader?ReactDOM'
      }
    ]
  },
  postcss: function() {
    return [
      autoprefixer( {
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR'
        ]
      } )
    ];
  },
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}
