/*
 * See config/index.js for further explanation.
 * this is global settings, the default for development
 */
var config = {};

config.env = 'development';
config.hostname = 'localhost';

//mongo database credentials
config.mongo = {};
config.mongo.uri = process.env.MONGO_URI || 'localhost';
config.mongo.db = 'boycott_dev_db';
config.mongo.port = 27017;

module.exports = config;