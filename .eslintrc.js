module.exports = {
  parser: '@babel/eslint-parser',
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.d.ts', '.tsx'],
      },
    },
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-redux/recommended',
    'plugin:react/jsx-runtime',
    'plugin:jsdoc/recommended',
    'plugin:jsx-a11y/recommended',
    'react-app',
    'react-app/jest',
    'prettier',
  ],
  overrides: [
    {
      files: ['**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
  parserOptions: {
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
    sourceType: 'module',
  },
  // Some plugins are automatically included.
  // Run `yarn eslint --print-config foo.js > bar.json` to see included plugins.
  // plugins: [],
  rules: {
    'id-length': ['error', { min: 2 }],
    'jsdoc/require-hyphen-before-param-description': ['warn', 'always'],
    'jsdoc/tag-lines': ['error', 'any', { startLines: 1 }],
    'no-console': ['warn'],
    'no-use-before-define': ['error'],
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
  },
};
