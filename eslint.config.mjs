// Run `npx @eslint/config-inspector` to inspect the config.

import globals from 'globals';
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jsdoc from 'eslint-plugin-jsdoc';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactReduxPlugin from 'eslint-plugin-react-redux';
import pluginCypress from 'eslint-plugin-cypress/flat';
import eslintConfigPrettier from 'eslint-config-prettier';
import babelParser from '@babel/eslint-parser';

export default [
  {
    ignores: ['\*_/**fixtures**/_.js', 'serviceWorker.js']
  },
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  jsdoc.configs['flat/recommended'],
  jsxA11y.flatConfigs.recommended,
  reactPlugin.configs.flat.recommended,
  pluginCypress.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      'react-hooks': reactHooksPlugin,
      'react-redux': reactReduxPlugin
    }
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
      },
    },
    settings: {
      'import/resolver': {
        node: {
          paths: ['src'],
          extensions: ['.js', '.jsx', '.ts', '.d.ts', '.tsx']
        },
      },
      react: {
        version: 'detect',
      },
    },
    rules: {
        'id-length': ['error', { min: 2 }],
        'jsdoc/require-hyphen-before-param-description': ['warn', 'always'],
        'jsdoc/tag-lines': ['error', 'any', { startLines: 1 }],
        'no-console': ['warn'],
        'no-use-before-define': ['error','nofunc'],
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
        ...reactReduxPlugin.configs.recommended.rules
    },
  },
];