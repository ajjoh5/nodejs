var RethinkDB = function(options) {

    //RethinkDB libary
    var r = require('rethinkdb');

    //Bluebird promises
    var Promise = require('bluebird');

    //File based winston logging
    var logger = require('../lib/winston-logger.js');

    //Other libraries
    var _ = require('underscore');

    //Init vars
    var isDBInit = false;
    var dbConn = {};


    //If no options supplied use defaults
    if (!options) {
        options.host = 'localhost';
        options.port = 28015;
    }

    function initDB(callback) {
        r.connect({ host: options.host, port: options.port, db: options.db }, function(err, conn) {
            if (err) { callback(err, null); }
            else { isDBInit = true; dbConn = conn; callback(null, conn); }
        });
    }

    return {

        getDB: function(callback) {
            initDB(function(err, conn) {
                if(err) { logger.log('error', 'Unable to connect to RethinkDB. Error was - ' + err); }
                else {
                    logger.log('debug', 'Connected successfully to database: ' + options.host + ':' + options.port);
                    callback(err, conn, r);
                }
            });
        }
    }

};

module.exports.create = function(options) {
    return new RethinkDB(options);
};