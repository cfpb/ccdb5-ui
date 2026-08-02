// Run `npx @eslint/config-inspector` to inspect the config.
// Aligned with DSR: ESLint 10 + typescript-eslint + unicorn recommended.
// JS-only app: use non-type-checked TS presets until files migrate to TypeScript.

import globals from 'globals';
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import jestDomPlugin from 'eslint-plugin-jest-dom';
import jsdoc from 'eslint-plugin-jsdoc';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import testingLibraryPlugin from 'eslint-plugin-testing-library';
import pluginCypress from 'eslint-plugin-cypress';
import eslintConfigPrettier from 'eslint-config-prettier';
import unicorn from 'eslint-plugin-unicorn';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'node_modules/**',
      '.yarn/**',
      '*_/**fixtures**/_.js',
      'serviceWorker.js',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  importPlugin.flatConfigs.recommended,
  jsdoc.configs['flat/recommended'],
  jsxA11y.flatConfigs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  // Match DSR: unicorn recommended (includes unicorn/filename-case → kebabCase)
  unicorn.configs.recommended,
  // Prettier always last (same as DSR)
  eslintConfigPrettier,

  {
    languageOptions: {
      ecmaVersion: 2023,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
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
    plugins: {
      jest: jestPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.eslint.json',
        },
        node: {
          moduleDirectory: [
            'node_modules',
            'src',
            'node_modules/@cfpb/cfpb-design-system/src/components/cfpb-icons/icons',
          ],
          extensions: ['.js', '.jsx', '.ts', '.d.ts', '.tsx', '.scss', '.css'],
        },
      },
      'import/core-modules': ['@cfpb/design-system-react', '@icons'],
      jest: {
        version: 30,
      },
      // Pin version like DSR — avoids eslint-plugin-react + ESLint 10 getFilename bug
      react: {
        version: '19',
      },
    },
    rules: {
      'id-length': ['error', { min: 2 }],
      'import/no-unresolved': [
        'error',
        {
          ignore: [
            '\\.svg\\?react$',
            '^@icons',
            '^@cfpb/design-system-react',
            '^@cfpb/cfpb-design-system/',
          ],
        },
      ],
      ...jestPlugin.configs.recommended.rules,
      'jsdoc/require-hyphen-before-param-description': ['warn', 'always'],
      'jsdoc/tag-lines': ['error', 'any', { startLines: 1 }],
      'no-console': ['warn'],

      // Match DSR unicorn overrides
      'unicorn/prevent-abbreviations': 'off', // Airbnb was less strict than Unicorn
      'unicorn/null-data-property': 'off',
      'unicorn/no-null': 'off',
      // Unicorn 72 companion to prevent-abbreviations (same rename campaign DSR opted out of)
      'unicorn/name-replacements': 'off',
      // App bootstrap (dayjs plugins, store, analytics) — DSR is a component lib without this
      'unicorn/no-top-level-side-effects': 'off',
      // ccdb5: keep Jest convention dirs; kebab-case the rest (DSR uses recommended default)
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
          ignore: ['^__fixtures__$', '^__tests__$', '^__mocks__$'],
        },
      ],

      'no-use-before-define': 'off',
      // variables:false — createSlice action refs used in addMatcher before export
      '@typescript-eslint/no-use-before-define': [
        'error',
        { functions: false, variables: false },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
        },
      ],
      // Allow empty stubs / no-op handlers common in React event wiring
      '@typescript-eslint/no-empty-function': 'off',
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
      'react/jsx-curly-brace-presence': ['error'],
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },

  // Unit tests: Testing Library + jest-dom
  {
    files: ['**/*.{spec,test}.{js,jsx,ts,tsx}'],
    plugins: {
      'testing-library': testingLibraryPlugin,
      'jest-dom': jestDomPlugin,
    },
    rules: {
      ...testingLibraryPlugin.configs['flat/react'].rules,
      ...jestDomPlugin.configs['flat/recommended'].rules,
      // jsdom does not implement Element#getHTML(); keep innerHTML in unit tests.
      'unicorn/prefer-dom-node-html-methods': 'off',
      // Specs routinely assign mocks onto globals / prototypes
      'unicorn/no-global-object-property-assignment': 'off',
      // Nested helpers inside describe/it are normal Jest style
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/no-top-level-assignment-in-function': 'off',
      // getElementById is fine when asserting the production mount id
      'unicorn/prefer-query-selector': 'off',
    },
  },

  // Tour specs intentionally assert document/shadow DOM query patching
  {
    files: ['**/tour/**/*.{spec,test}.{js,jsx,ts,tsx}'],
    rules: {
      'testing-library/no-node-access': 'off',
    },
  },

  // Cypress e2e only (not applied to src)
  {
    ...pluginCypress.configs.recommended,
    files: ['cypress/**/*.{js,ts}'],
  },
  {
    files: ['cypress/**/*.{js,ts}'],
    rules: {
      'jest/expect-expect': 'off',
      'jest/valid-expect': 'off',
    },
  },

  // ccdb5-only: large numeric API fixtures (DSR has no equivalent). Keep readable diffs.
  {
    files: [
      '**/fixture.js',
      '**/fixture*.js',
      '**/__fixtures__/**',
      '**/fixtures/**',
    ],
    rules: {
      'unicorn/numeric-separators-style': 'off',
      'unicorn/no-zero-fractions': 'off',
    },
  },

  // Cypress plugins remain CJS; chart libs bind `this` in callbacks
  {
    files: ['cypress/plugins/**'],
    rules: {
      'unicorn/prefer-module': 'off',
      'unicorn/no-anonymous-default-export': 'off',
    },
  },
  {
    files: [
      '**/tile-map/**',
      '**/row-chart/**',
      '**/line-chart/**',
      '**/stacked-area-chart/**',
    ],
    rules: {
      'unicorn/no-this-outside-of-class': 'off',
    },
  },
);
