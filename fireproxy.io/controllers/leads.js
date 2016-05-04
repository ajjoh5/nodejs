var test = function(options) {

    return {

        execute : function(req, db) {

            console.log('leads.js');

            //Create particle DB reference
            var particleDB = require('../lib/particle-io').create({ authtoken : 'ff1bc4174529248c949e04d601fecc2f7c7dde5a32367ebff5f559b0fcf2615a'});

            var url = require('url');
            var urlParts = url.parse(req.url, true);
            var urlPath = urlParts.path;

            var message = '';

            var logEntry = {
                __type: 'info',
                __group: 'newlead',
                handler : 'leads.js',
                httpMethod : 'post',
                httpStatusCode : 200,
                path : urlPath,
                exTime : 1,
                message : message,
                lead : req.body
            };

            //Send log entry to particle.io
            particleDB.new(logEntry, function(err, data) {
                if(err) {
                    logEntry.created = dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT');
                    db['fail-logs'].insert(logEntry);
                }
            });

            //return req;
            return true;
        }

    }
};

module.exports.create = function(options) {
    return new test(options);
};