var bunyan = require('bunyan');
var config = require('./config/app');

module.exports = bunyan.createLogger(config.logger);
