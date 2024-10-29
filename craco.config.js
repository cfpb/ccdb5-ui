const CracoEsbuildPlugin = require('craco-esbuild');
const path = require('path');
const {
  addAfterLoader,
  addAfterLoaders,
  addBeforeLoader,
  addAfterAssetModule,
  assetModuleByName,
  getLoader,
  getLoaders,
  removeLoader,
  loaderByName,
  throwUnexpectedConfigError,
} = require('@craco/craco');

const { ProvidePlugin } = require('webpack');

module.exports = {
  webpack: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      css: path.resolve(__dirname, 'src/css')
    },
    configure: (webpackConfig, { env, paths }) => {
      const strReplaceLoader = {
        // test: /constants\/index\.js$/,
        test: /\.js/,
        loader: require.resolve('string-replace-loader'),
        include: [path.resolve(__dirname, 'src/constants')],
        options: {
          multiple: [
            {
              search: '@@API',
              replace(match, p1, offset, string) {
                const replacement =
                  '/data-research/consumer-complaints/search/api/v1/';
                console.log(
                  `Replaced "${match}" in file "${this.resource}" with "${replacement}.`,
                );
                return replacement;
              },
              flags: 'g',
              //strict: true,
            },
          ],
        },
      };

      webpackConfig.ignoreWarnings = [
        function ignoreSourcemapsloaderWarnings(warning) {
          return (
            warning.module &&
            warning.module.resource.includes('node_modules') &&
            warning.details &&
            warning.details.includes('source-map-loader')
          );
        },
      ];

      addBeforeLoader(
        webpackConfig,
        loaderByName('babel-loader'),
        strReplaceLoader,
      );

      //
      return webpackConfig;
    },
    plugins: [
      new ProvidePlugin({
        React: 'react',
      }),
    ],
  },
  plugins: [
    {
      plugin: CracoEsbuildPlugin,
      options: {
        esbuildLoaderOptions: {
          // Optional. Defaults to auto-detect loader.
          loader: 'jsx', // Set the value to 'tsx' if you use typescript
          target: 'es2015',
        },
        skipEsbuildJest: true, // Optional. Set to true if you want to use babel for jest tests,
      },
    },
  ],
  style: {
    sass: {
      loaderOptions: {
        api: 'modern',
        sassOptions: {
          loadPaths: ['node_modules', 'src']
        }
      }
    }
  }
};
