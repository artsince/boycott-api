/*
 * The idea and the code are taken, and appropriated from StackOverflow
 * http://stackoverflow.com/a/13574878/210391 
 * There will be a global config file, and an additional config file 
 * for each environment setting
 */
var env = process.env.NODE_ENV || 'development',
    cfg = require('./config.' + env);

module.exports = cfg;