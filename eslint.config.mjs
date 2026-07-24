// Run `npx @eslint/config-inspector` to inspect the config.
// Aligned with DSR: ESLint 10 + typescript-eslint + unicorn recommended.

import globals from 'globals';
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
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
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  importPlugin.flatConfigs.recommended,
  jsdoc.configs['flat/recommended'],
  jsxA11y.flatConfigs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  pluginCypress.configs.recommended,
  // Match DSR: unicorn recommended (includes unicorn/filename-case → kebabCase)
  unicorn.configs.recommended,
  // Prettier always last (same as DSR)
  eslintConfigPrettier,

  {
    languageOptions: {
      ecmaVersion: 2023,
      parserOptions: {
        projectService: true,
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
      'testing-library': testingLibraryPlugin,
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
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/null-data-property': 'off',
      'unicorn/no-null': 'off',
      // Unicorn 72: rename campaign is too large for this JS app right now
      'unicorn/name-replacements': 'off',
      // Keep Jest convention dirs; kebab-case the rest
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
          ignore: ['^__fixtures__$', '^__tests__$', '^__mocks__$'],
        },
      ],
      // Extremely noisy on large numeric fixtures
      'unicorn/numeric-separators-style': 'off',
      'unicorn/no-zero-fractions': 'off',
      // Impractical on this codebase (d3/highcharts `this`, CJS cypress/colors, reducers)
      'unicorn/no-this-outside-of-class': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/no-anonymous-default-export': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-top-level-side-effects': 'off',
      'unicorn/no-global-object-property-assignment': 'off',
      'unicorn/consistent-boolean-name': 'off',
      'unicorn/default-export-style': 'off',
      'unicorn/prefer-await': 'off',
      'unicorn/no-computed-property-existence-check': 'off',
      'unicorn/no-declarations-before-early-exit': 'off',
      'unicorn/prefer-simple-condition-first': 'off',
      'unicorn/prefer-number-coercion': 'off',
      'unicorn/no-unnecessary-global-this': 'off',
      'unicorn/no-break-in-nested-loop': 'off',
      'unicorn/max-nested-calls': 'off',
      'unicorn/consistent-class-member-order': 'off',
      'unicorn/no-unreadable-for-of-expression': 'off',
      'unicorn/require-array-sort-compare': 'off',
      'unicorn/prefer-minimal-ternary': 'off',
      'unicorn/no-top-level-assignment-in-function': 'off',
      'unicorn/prefer-object-iterable-methods': 'off',
      'unicorn/no-duplicate-loops': 'off',
      'unicorn/prefer-simple-sort-comparator': 'off',
      'unicorn/no-invalid-argument-count': 'off',
      // getHTML() not reliable in jsdom test environment
      'unicorn/prefer-dom-node-html-methods': 'off',
      // Prefer explicit coercions in a mostly-untyped JS codebase
      'unicorn/no-useless-coercion': 'off',
      'unicorn/no-useless-boolean-cast': 'off',
      // Keep explicit Boolean()/String() coercions for clarity
      'unicorn/prefer-native-coercion-functions': 'off',
      'unicorn/no-typeof-undefined': 'off',
      'unicorn/prefer-logical-operator-over-ternary': 'off',
      'unicorn/prefer-modern-dom-apis': 'off',

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
    },
  },

  // Untyped JS/JSX: keep type-checked pipeline, silence unsafe-* until files migrate to TS
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/prefer-regexp-exec': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },

  // Overrides for Cypress files
  {
    files: ['cypress/**/*.{js,ts}'],
    rules: {
      'jest/expect-expect': 'off',
      'jest/valid-expect': 'off',
    },
  },

  // Config files: no type-aware project needed
  {
    files: ['**/*.{mjs,cjs}', 'jest.config.js', 'jest.setup.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
