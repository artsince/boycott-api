/*
 * See config/index.js for further explanation.
 * test config overrides global config values
 */

var config = require('./config.global');

config.env = 'test';
config.mongo.db = 'boycott_test_db';

config.mongo.uri = 'localhost';
config.mongo.db = 'boycott_test_db';

// config.mongo.user = '';
// config.mongo.pass = '';
// config.mongo.port = 27017;

config.mongo.connectionString = 'mongodb://' + config.mongo.uri + '/' + config.mongo.db;

module.exports = config;