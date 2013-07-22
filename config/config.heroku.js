/*
 * See config/index.js for further explanation.
 * heroku config overrides global config values
 * this file is indexed to be assumed unchanged from now on
 */

var config = require('./config.global');

config.env = 'heroku';
config.mongo.uri = '';
config.mongo.db = '';
config.mongo.user = '';
config.mongo.pass = '';
config.mongo.port = 10010;

config.mongo.connectionString = 'mongodb://' + config.mongo.user + ':' + config.mongo.pass + '@' + config.mongo.uri + ':' + config.mongo.port + '/' + config.mongo.db;

module.exports = config;