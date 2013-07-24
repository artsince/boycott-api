/*
 * See config/index.js for further explanation.
 * this is global settings, the default for global
 */
var config = {};

config.env = '';
config.uri = '';

//mongo database credentials

config.mongo = {};
config.mongo.uri = '';
config.mongo.db = '';

// config.mongo.user = '';
// config.mongo.pass = '';
// config.mongo.port = 27017;

config.mongo.connectionString = '';

module.exports = config;