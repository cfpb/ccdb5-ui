const { pluginProcessIcons } = require('./postcss/postcss-process-icons');
module.exports = {
  plugins: [require('autoprefixer'), pluginProcessIcons],
};
