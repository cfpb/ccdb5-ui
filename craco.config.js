const CracoLessPlugin = require('craco-less');
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
const webpack = require('webpack');

module.exports = {
  webpack: {
    alias: {},
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
                  `Replaced "${match}" in file "${this.resource}" with "${replacement}.`
                );
                return replacement;
              },
              flags: 'g',
              //strict: true,
            },
          ],
        },
      };
      addBeforeLoader(
        webpackConfig,
        loaderByName('babel-loader'),
        strReplaceLoader
      );

      //
      return webpackConfig;
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              hack: `true;@import (reference) "${require.resolve(
                './src/css/base.less'
              )}";`,
            },
            javascriptEnabled: true,
            math: 'always',
          },
        },
      },
    },
  ],
};
