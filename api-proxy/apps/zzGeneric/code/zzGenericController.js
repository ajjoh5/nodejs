var zzGenericController = function(app) {

    var request = require('request');
    var url = require('url');
    var format = require('string-format');
    var bodyParser = require('body-parser');
    var dateFormat = require('dateformat');

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Generic Catch All - GET METHOD
    app.get('/?*', function(req, res) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;
        var newUrl = 'http://localhost:5050' + urlPath;
        var start = new Date();

        //Time how long url takes to serve
        //console.time(format('[v1 - default route - {0}]', urlPath));

        request.get(newUrl, function(error, response, body) {

            var json = {};
            var logEntry = {
                sourceType : 'zzGeneric',
                request : {}
            };

            //Set the response to whatever we get back (include all options)
            res.set(response.headers);
            res.send(body);

            var responseTime = new Date() - start;

            if(!error && response.statusCode == 200) {
                var contentType = response.headers['content-type'];
                if(contentType.indexOf('application/json') > -1) {
                    var json = JSON.parse(body);
                    var message = (!json.ResponseMessage) ? '' : json.ResponseMessage;
                    logEntry.request = { level : 'Info', date : dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT'), type : 'GET', httpStatusCode : response.statusCode, path : urlPath, exTime : responseTime, message : message };

                    var hookOptions = {
                        url: 'https://zapier.com/hooks/catch/294068/ubqxjb',
                        method: 'POST',
                        body : JSON.stringify(logEntry.request)
                    };
                    request(hookOptions);
                }
            }
            else {
                logEntry.request = { level : 'Error', date : dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT'), type : 'GET', httpStatusCode : response.statusCode, path : urlPath, exTime : responseTime, message : error };

                var hookOptions = {
                    url: 'https://zapier.com/hooks/catch/294068/ubqxjb',
                    method: 'POST',
                    body : JSON.stringify(logEntry.request)
                };
                request(hookOptions);
            }

            res.end();

        });
    });

    // Generic Catch All - GET METHOD
    app.post('/?*', function(req, res) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;

        var newUrl = 'http://localhost:5050' + urlPath;
        var start = new Date();

        var options = {
            url: newUrl,
            method: 'POST'
        };

        //Determine request (post type) to ensure request options setup correctly
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

        request(options, function(error, response, body) {

            //init response variables
            //Set error to be what's returned in body, if anywhere in the body, contains the string = 'error'
            var errorMessage = (!body && !body.toLowerCase().indexOf('error') > -1) ? '-' : body;
            var logEntry = {
                sourceType : 'zzGeneric',
                request : {}
            };

            //Set the response to whatever we get back (include all options)
            res.set(response.headers);
            res.send(body);

            //Calculate the response time
            var responseTime = new Date() - start;

            //Determine what to log
            if (!error && response.statusCode == 200) {

                var responseContentType = response.headers['content-type'];
                if (responseContentType.indexOf('application/json') > -1) {
                    var message = (!body.ResponseMessage) ? '' : body.ResponseMessage;
                    logEntry.request = { level : 'Info', date : dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT'), type : 'POST', httpStatusCode : response.statusCode, path : urlPath, exTime : responseTime, message : message };

                    var hookOptions = {
                        url: 'https://zapier.com/hooks/catch/294068/ubqxjb',
                        method: 'POST',
                        body : JSON.stringify(logEntry.request)
                    };
                    request(hookOptions);
                }
            }
            else {
                logEntry.request = { level : 'Error', date : dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT'), type : 'POST', httpStatusCode : response.statusCode, path : urlPath, exTime : responseTime, message : errorMessage };

                var hookOptions = {
                    url: 'https://zapier.com/hooks/catch/294068/ubqxjb',
                    method: 'POST',
                    body : JSON.stringify(logEntry.request)
                };
                request(hookOptions);
            }

            //End response
            res.end();
        });
    });

};

module.exports = zzGenericController;