module.exports = {
  presets: [
    '@babel/preset-env',
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
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
