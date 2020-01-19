'use strict';

const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/api_prefix', { target: process.env.npm_package_config_MOCK_SERVER }));
};
