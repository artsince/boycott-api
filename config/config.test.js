/*
 * See config/index.js for further explanation.
 * test config overrides global config values
 */

var config = require('./config.global');

config.env = 'test';
config.mongo.db = 'boycott_test_db';

module.exports = config;