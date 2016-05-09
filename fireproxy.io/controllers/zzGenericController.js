var zzGenericController = function(app) {

    console.log('> zzGenericController.js');

    var url = require('url');
    var bodyParser = require('body-parser');
    var request = require('request');
    var dateFormat = require('dateformat');

    //Create logging backup db on filesystem
    var Datastore = require('nedb');
    var db = {};
    db['fail-logs'] = new Datastore({ filename: __base + '/logs/fail-logs.db', autoload: true});

    //Create particle DB reference
    var particleDB = require('../lib/particle-io').create({ authtoken : 'ff1bc4174529248c949e04d601fecc2f7c7dde5a32367ebff5f559b0fcf2615a'});

    app.get('/favicon.ico', function(req, res) {
        res.status(404).send('No favicon.');
    });

    app.all('/?*', function(req, res) {
        var start = new Date();

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;

        //Ability to change proxy URL from override controllers
        var proxyUrl = req.proxyUrl;
        if (!proxyUrl) {
            proxyUrl = 'http://localhost:5050' + urlPath;
        }

        var reqMethod = req.method.toLowerCase();

        var options = {
            url: proxyUrl,
            method: req.method,
            headers: {
                'X-Forwarded-By': 'fireproxy.io'
            }
        };

        if(reqMethod === 'post') {
            var contentType = req.headers['content-type'];
            if(contentType) {
                if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
                    options.form = req.body;
                }
                else {
                    //assume json eg. if (contentType.indexOf('application/json') > -1)
                    options.json = true;
                    options.body = req.body;
                }
            }
        }


        request(options)
        .on('error', function(err) {
            //capture and log errors
            var responseTime = new Date() - start;

            var logEntry = {
                __type: 'error',
                __group: 'fireproxy-io.' + reqMethod,
                __id: new Date().getTime(),
                handler : 'zzGeneric',
                httpMethod : reqMethod.toUpperCase(),
                httpStatusCode : response.statusCode,
                path : urlPath,
                message : err,
                exTime : responseTime
            };

            //Send log entry to particle.io
            particleDB.new(logEntry, function(err, data) {
                if(err) {
                    logEntry.created = dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT');
                    db['fail-logs'].insert(logEntry);
                }
            });
        })
        .on('response', function(response) {
            var body = '';

            //get body in case we need it later
            response.on('data', function (chunk) {
                body += chunk;
            });

            response.on('end', function () {
                //body will now contain full result (chunked)
                //Intercept the response + log the results
                var responseTime = new Date() - start;
                var message = '';

                if (response.headers['content-type'] && response.headers['content-type'].indexOf('application/json') > -1) {
                    message = (!body.ResponseMessage) ? '' : body.ResponseMessage;
                }

                var logEntry = req.logEntry;
                if(!logEntry) {
                    logEntry = {
                        __type: 'info',
                        __group: 'fireproxy-io.' + reqMethod,
                        __id: new Date().getTime(),
                        handler : 'zzGeneric',
                        httpMethod : reqMethod.toUpperCase(),
                        httpStatusCode : response.statusCode,
                        path : urlPath,
                        message : message
                    };
                }

                //handle non status code 200 responses, and add in response body to track error
                if(response.statusCode != 200) {
                    logEntry.__type = 'error';
                    logEntry.message = (!body) ? message : body;
                }

                //always add the elapsed time
                logEntry.exTime = responseTime;

                //Send log entry to particle.io
                particleDB.new(logEntry, function(err, data) {
                    if(err) {
                        logEntry.created = dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT');
                        db['fail-logs'].insert(logEntry);
                    }
                });
            });
        })
        .pipe(res);

    });
};

module.exports = zzGenericController;