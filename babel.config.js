module.exports = {
  presets: [
    ['@babel/preset-env', { targets: 'defaults' }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    ['@babel/preset-typescript', { allowDeclareFields: true }],
  ],
  plugins: [
    '@babel/plugin-transform-modules-commonjs',
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@icons':
            './node_modules/@cfpb/cfpb-design-system/src/components/cfpb-icons/icons',
        },
      },
    ],
  ],
};
