/*
 * See config/index.js for further explanation.
 * this is global settings, the default for development
 */
var config = {};

config.env = 'development';
config.uri = 'localhost';

//mongo database credentials
config.mongo = {};
config.mongo.uri = process.env.MONGO_URI || 'localhost';
config.mongo.db = 'boycott_dev_db';

// config.mongo.user = '';
// config.mongo.pass = '';
// config.mongo.port = 27017;

config.mongo.connectionString = 'mongodb://' + config.mongo.uri + '/' + config.mongo.db;

module.exports = config;