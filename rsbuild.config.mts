import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginSvgr } from '@rsbuild/plugin-svgr';

export default defineConfig({
  dev: {
    // Prevent disk writes in dev to avoid rebuild loops.
    writeToDisk: false,
    // Avoid on-demand chunk compilation that can trigger repeated reloads.
    lazyCompilation: false,
  },
  html: {
    template: './public/index.html',
  },
  output: {
    distPath: {
      js: '',
      css: '',
      font: 'static/fonts',
    },
    filename: {
      js: 'ccdb5.js', // Custom name for JavaScript files
      css: 'ccdb5.css', // Custom name for CSS files
    },
    filenameHash: false,
  },
  performance: {
    chunkSplit: {
      strategy: 'all-in-one',
    },
  },
  tools: {
    rspack: (config, { appendRules }) => {
      // Inline dynamic imports (e.g. from @cfpb/design-system-react) into the
      // main bundle so we get a single ccdb5.js instead of many async chunks.
      config.output = config.output || {};
      config.output.asyncChunks = false;

      // Ignore dist output so file watching doesn't trigger rebuild loops.
      config.watchOptions = config.watchOptions || {};
      const ignored = config.watchOptions.ignored;
      if (!ignored) {
        config.watchOptions.ignored = ['**/dist/**'];
      } else if (Array.isArray(ignored)) {
        config.watchOptions.ignored = [...ignored, '**/dist/**'];
      } else {
        config.watchOptions.ignored = [ignored, '**/dist/**'];
      }

      appendRules({
        test: /\.js/, // Or any other file extension you want to apply the loader to
        loader: 'string-replace-loader',
        options: {
          search: '@@API', // The string or regex to search for
          replace: '/data-research/consumer-complaints/search/api/v1/', // The string to replace it with
          // You can also use 'multiple' for multiple replacements or a 'callback' function
          // multiple: [{ search: 'str1', replace: 'new1' }, { search: 'str2', replace: 'new2' }],
          // callback: (match) => { /* dynamic replacement logic */ return 'newString'; }
        },
      });
    },
  },
  plugins: [
    pluginSass({
      include: /\.scss$/,
      sassLoaderOptions: {
        api: 'modern',
        sassOptions: {
          loadPaths: ['node_modules', 'src'],
        },
      },
    }),
    pluginReact(),
    pluginSvgr({
      svgrOptions: {
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  cleanupIds: false,
                },
              },
            },
            {
              name: 'prefixIds',
              params: {
                prefixClassNames: false,
                prefixIds: false,
              },
            },
          ],
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@icons':
        './node_modules/@cfpb/cfpb-design-system/src/components/cfpb-icons/icons',
    },
  },
  server: {
    proxy: {
      // http://localhost:3000/api -> http://localhost:3000/api
      // http://localhost:3000/api/foo -> http://localhost:3000/api/foo
      '/data-research': 'https://www.consumerfinance.gov',
    },
  },
});
