// Run `npx @eslint/config-inspector` to inspect the config.

import globals from 'globals';
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import jestDom from 'eslint-plugin-jest-dom';
import jsdoc from 'eslint-plugin-jsdoc';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactReduxPlugin from 'eslint-plugin-react-redux';
import testingLibraryPlugin from 'eslint-plugin-testing-library';
import pluginCypress from 'eslint-plugin-cypress';
import eslintConfigPrettier from 'eslint-config-prettier';
import unicorn from 'eslint-plugin-unicorn';
import babelParser from '@babel/eslint-parser';

export default [
  {
    ignores: ['*_/**fixtures**/_.js', 'serviceWorker.js'],
  },
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  jestDom.configs['flat/recommended'],
  jsdoc.configs['flat/recommended'],
  jsxA11y.flatConfigs.recommended,
  reactPlugin.configs.flat.recommended,
  pluginCypress.configs.recommended,
  // Match DSR: unicorn recommended (includes unicorn/filename-case → kebabCase).
  // DSR uses unicorn ^72 (eslint 10); we use ^65 for eslint 9 compatibility.
  unicorn.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      jest: jestPlugin,
      'testing-library': testingLibraryPlugin,
      'react-hooks': reactHooksPlugin,
      'react-redux': reactReduxPlugin,
    },
  },
  {
    languageOptions: {
      ecmaVersion: 2023,
      parser: babelParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        JSX: 'readonly',
      },
    },
    settings: {
      'import/resolver': {
        node: {
          moduleDirectory: [
            'node_modules',
            'src',
            'node_modules/@cfpb/cfpb-design-system/src/components/cfpb-icons/icons',
          ],
          extensions: ['.js', '.jsx', '.ts', '.d.ts', '.tsx', '.scss', '.css'],
        },
      },
      // Treat these as internal/global so ESLint doesn't complain about them being unresolved
      'import/core-modules': ['@cfpb/design-system-react', '@icons'],
      jest: {
        version: 30,
      },
      react: {
        version: 'detect',
      },
    },
    rules: {
      'id-length': ['error', { min: 2 }],
      'import/no-unresolved': [
        'error',
        {
          ignore: ['\\.svg\\?react$', '^@icons', '^@cfpb/design-system-react'],
        },
      ],
      ...jestPlugin.configs.recommended.rules,
      'jsdoc/require-hyphen-before-param-description': ['warn', 'always'],
      'jsdoc/tag-lines': ['error', 'any', { startLines: 1 }],
      'no-console': ['warn'],
      // Match DSR unicorn overrides
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      // Keep Jest convention dirs; kebab-case the rest (same rule DSR relies on)
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
          ignore: ['^__fixtures__$', '^__tests__$', '^__mocks__$'],
        },
      ],
      // Extremely noisy on large numeric fixtures; little value for this app
      'unicorn/numeric-separators-style': 'off',
      'unicorn/no-zero-fractions': 'off',
      // Impractical on this codebase (d3/highcharts `this`, CJS cypress/colors, reducers)
      'unicorn/no-this-outside-of-class': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/no-anonymous-default-export': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'no-use-before-define': ['error', 'nofunc'],
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
        },
      ],
      'no-var': ['error'],
      'prefer-const': ['error'],
      radix: ['error'],
      'react/jsx-no-leaked-render': [
        'error',
        { validStrategies: ['coerce', 'ternary'] },
      ],
      'react/no-multi-comp': ['error', { ignoreStateless: true }],
      'react/no-unstable-nested-components': ['error'],
      'react/self-closing-comp': ['error'],
      'react/boolean-prop-naming': ['error', { validateNested: true }],
      'react/default-props-match-prop-types': [
        'error',
        { allowRequiredDefaults: true },
      ],
      'react/jsx-curly-brace-presence': ['error'],
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      ...reactHooksPlugin.configs.recommended.rules,
      ...reactReduxPlugin.configs.recommended.rules,
    },
  },
  // Overrides for Cypress files
  {
    files: ['cypress/**/*.js', 'cypress/**/*.ts'],
    rules: {
      'jest/expect-expect': 'off',
      'jest/valid-expect': 'off',
    },
  },
];
