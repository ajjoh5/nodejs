//init variables
var assert = require('assert');
var path = require('path');
var fs = require('fs-extra');
var dateFormat = require('dateformat');
global.__base = path.dirname(__dirname);

//Add in Classes / Controllers
var logger = require('../lib/winston-logger.js');
var logFileDir = __base + '/lib/logs/';

//Create particle DB reference
var particleDB = require('../lib/particle-io').create({ authtoken : '6d26752b5d666f6b7a5367395e287456716372284c28534a3957684829'});


describe('Logging Tests', function() {

    before(function() {
        // --[ TEARDOWN SCRIPTS ]--
        //Empty log files directory
        fs.emptyDir(logFileDir, function (err) {
            if (!err) {}
        });
    });

    it('Log 1 record to logfile - located: ' + logFileDir, function(done) {

        // logger.add(logger.transports.File, { filename : logFileLocation });
        logger.info('This is a test log', { seriously: true }, function(err, level, msg, meta) {
            assert.equal(msg, 'This is a test log');
            done();
        });

        var fileExists = false;
        var logFile = logFileDir + 'all-logs_' + dateFormat(new Date(), 'yyyy-mm-dd') + '.log';
    });

    it('Ensure log to particle logs also to winston', function (done) {

        var logEntry = {
            __type: 'error',
            __group: 'fireproxy-io.get',
            __id: new Date().getTime(),
            handler : 'zzGeneric',
            httpMethod : 'GET',
            httpStatusCode : 200,
            path : '/jobapi/Jobs/303090?keytoken=123456',
            message : '',
            exTime : 1532
        };


        //Log particle to winston logs
        // var logType = (!logEntry.__type) ? 'info' : logEntry.__type;
        // logger.log(logType, { particle : logEntry });

        //Send log entry to particle.io
        particleDB.new(logEntry, function(err, data) {
            assert.equal(data.particle.path, '/jobapi/Jobs/303090?keytoken=123456');
            done();
        });
    });

});