/* istanbul ignore file */
const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(
    ['/data-research/consumer-complaints/search/api/**/**'],
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
    }),
  );
};
