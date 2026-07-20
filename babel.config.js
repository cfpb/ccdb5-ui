const transformImportMetaForJest = ({ types: babelTypes }) => ({
  visitor: {
    MetaProperty(path) {
      if (
        path.node.meta.name !== 'import' ||
        path.node.property.name !== 'meta'
      ) {
        return;
      }

      const parent = path.parentPath;

      if (parent.isMemberExpression() && parent.node.property.name === 'hot') {
        parent.replaceWith(babelTypes.booleanLiteral(false));
        return;
      }

      path.replaceWith(babelTypes.objectExpression([]));
    },
  },
});

module.exports = (api) => {
  const isTest = api.env('test');

  return {
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
      isTest && transformImportMetaForJest,
      '@babel/plugin-transform-modules-commonjs',
    ].filter(Boolean),
  };
};
