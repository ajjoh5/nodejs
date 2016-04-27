var zzGenericController = function(app) {

    var request = require('request');
    var url = require('url');
    var format = require('string-format');
    var bodyParser = require('body-parser');
    var dateFormat = require('dateformat');

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Favicon route
    app.use('*/favicon.ico', function(req, res, next) {
        res.sendFile(__base + '/favicon.ico');
    });

    // Generic Catch All - GET METHOD
    app.get('/?*', function(req, res) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;
        //var newUrl = 'http://localhost:5050' + urlPath;
        var newUrl = 'http://webapi.henley.com.au' + urlPath;
        var start = new Date();

        request.get(newUrl, function(error, response, body) {

            //Set the response to whatever we get back (include all options)
            res.set(response.headers);
            res.send(body);

            var responseTime = new Date() - start;

            if(!error && response.statusCode == 200) {
                var message = '';
                var contentType = response.headers['content-type'];
                if(contentType.indexOf('application/json') > -1) {
                    var json = JSON.parse(body);
                    message = (!json.ResponseMessage) ? '' : json.ResponseMessage;
                }

                var logEntry = {
                    type: 'info',
                    group: 'apiproxy.get',
                    handler : 'zzGeneric',
                    httpMethod : 'GET',
                    httpStatusCode : response.statusCode,
                    path : urlPath,
                    exTime : responseTime,
                    message : message
                };

                var options = {
                    url: 'http://162.243.104.143/api/particles/new',
                    method: 'POST',
                    json : true,
                    body : logEntry,
                    headers : {
                        'authorization' : 'Bearer ff1bc4174529248c949e04d601fecc2f7c7dde5a32367ebff5f559b0fcf2615a'
                    }
                };

                request(options, function(error, response, body) {});
            }
            else {

                //Set error to be what's returned in body, if anywhere in the body, contains the string = 'error'
                var errorMessage = (body && body.toLowerCase().indexOf('error') > -1) ? body : '-';

                var logEntry = {
                    type: 'error',
                    group: 'apiproxy.get',
                    handler : 'zzGeneric',
                    httpMethod : 'GET',
                    httpStatusCode : response.statusCode,
                    path : urlPath,
                    exTime : responseTime,
                    message : errorMessage
                };

                var options = {
                    url: 'http://162.243.104.143/api/particles/new',
                    method: 'POST',
                    json : true,
                    body : logEntry,
                    headers : {
                        'authorization' : 'Bearer ff1bc4174529248c949e04d601fecc2f7c7dde5a32367ebff5f559b0fcf2615a'
                    }
                };

                request(options);
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

            //Set the response to whatever we get back (include all options)
            res.set(response.headers);
            res.send(body);

            //Calculate the response time
            var responseTime = new Date() - start;

            //Determine what to log
            if (!error && response.statusCode == 200) {

                var message = '';
                var responseContentType = response.headers['content-type'];

                //If return was json, get response message, else handle normally
                if (responseContentType.indexOf('application/json') > -1) {
                    message = (!body.ResponseMessage) ? '' : body.ResponseMessage;
                }

                var logEntry = {
                    type: 'info',
                    group: 'apiproxy.post',
                    handler : 'zzGeneric',
                    httpMethod : 'POST',
                    httpStatusCode : response.statusCode,
                    path : urlPath,
                    exTime : responseTime,
                    message : message
                };

                var options = {
                    url: 'http://162.243.104.143/api/particles/new',
                    method: 'POST',
                    json : true,
                    body : logEntry,
                    headers : {
                        'authorization' : 'Bearer ff1bc4174529248c949e04d601fecc2f7c7dde5a32367ebff5f559b0fcf2615a'
                    }
                };

                request(options);
            }
            else {

                //Set error to be what's returned in body, if anywhere in the body, contains the string = 'error'
                var errorMessage = (body && body.toLowerCase().indexOf('error') > -1) ? body : '-';

                var logEntry = {
                    type: 'error',
                    group: 'apiproxy.post',
                    handler : 'zzGeneric',
                    httpMethod : 'POST',
                    httpStatusCode : response.statusCode,
                    path : urlPath,
                    exTime : responseTime,
                    message : errorMessage
                };

                var options = {
                    url: 'http://162.243.104.143/api/particles/new',
                    method: 'POST',
                    json : true,
                    body : logEntry,
                    headers : {
                        'authorization' : 'Bearer ff1bc4174529248c949e04d601fecc2f7c7dde5a32367ebff5f559b0fcf2615a'
                    }
                };

                request(options);
            }

            //End response
            res.end();
        });
    });

};

module.exports = zzGenericController;