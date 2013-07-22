/*
 * See config/index.js for further explanation.
 * heroku config overrides global config values
 */

var config = require('./config.global');

config.env = 'heroku';
config.mongo.db = '';

module.exports = config;