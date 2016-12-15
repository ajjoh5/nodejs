var RethinkDB = function(options) {

    //RethinkDB libary
    var r = require('rethinkdb');

    //File based winston logging
    var logger = require('../lib/winston-logger.js');

    //If no options supplied use defaults
    if (!options) {
        options.host = 'localhost';
        options.port = 28015;
    }

    function initDB(callback) {
        r.connect( {host: options.host, port: options.port}, function(err, conn) {
            if (err) { callback(err, null); }
            else { callback(null, conn); }
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