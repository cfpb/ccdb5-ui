// Run `npx @eslint/config-inspector` to inspect the config.

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
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

export default [
  {
    ignores: ['*_/**fixtures**/_.js', 'serviceWorker.js'],
  },
  js.configs.recommended,
  ...fixupConfigRules(importPlugin.flatConfigs.recommended),
  ...fixupConfigRules(jestDom.configs['flat/recommended']),
  ...fixupConfigRules(jsdoc.configs['flat/recommended']),
  ...fixupConfigRules(jsxA11y.flatConfigs.recommended),
  ...fixupConfigRules(reactPlugin.configs.flat.recommended),
  ...fixupConfigRules(pluginCypress.configs.recommended),
  eslintConfigPrettier,
  {
    plugins: {
      jest: fixupPluginRules(jestPlugin),
      'testing-library': fixupPluginRules(testingLibraryPlugin),
      'react-hooks': fixupPluginRules(reactHooksPlugin),
      'react-redux': fixupPluginRules(reactReduxPlugin),
    },
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2023,
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
      'import/core-modules': [
        '@cfpb/design-system-react',
        '@icons',
        'react-router',
      ],
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
