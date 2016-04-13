var zzGenericController = function(app) {

    var request = require('request');
    var url = require('url');
    var format = require('string-format');
    var Logger = require('le_node');
    var bodyParser = require('body-parser');

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));

    // parse application/json
    app.use(bodyParser.json());

    var log = new Logger({
        token:'84a4090e-a184-44b2-8213-c09264ef1b98'
    });

    // Generic Catch All - GET METHOD
    app.get('/?*', function(req, res) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;
        var newUrl = 'http://api2.henley.com.au' + urlPath;
        var start = new Date();

        //Time how long url takes to serve
        //console.time(format('[v1 - default route - {0}]', urlPath));

        request.get(newUrl, function(error, response, body) {

            var json = {};
            var logEntry = {
                type : 'zzGeneric',
                request : {}
            };

            // if (!error && response.statusCode == 200) {
            //     json = JSON.parse(body);
            //     res.json(json);
            // }
            //console.log(body);

            //Set the response to whatever we get back (include all options)
            res.set(response.headers);
            res.send(body);

            var responseTime = new Date() - start;

            if(!error && response.statusCode == 200) {
                var contentType = response.headers['content-type'];
                if(contentType.indexOf('application/json') > -1) {
                    var json = JSON.parse(body);
                    var message = (!json.ResponseMessage) ? '' : json.ResponseMessage;
                    logEntry.request = { level : 'Info', date : new Date(), type : 'GET', httpStatusCode : response.statusCode, path : urlPath, exTime : responseTime, message : message };
                    //log.log('info', logEntry);

                    var hookOptions = {
                        url: 'https://zapier.com/hooks/catch/294068/ubqxjb',
                        method: 'POST',
                        body : JSON.stringify(logEntry.request)
                    };
                    request(hookOptions);
                }
            }

            if(error) {
                logEntry.request = { level : 'Error', date : new Date(), type : 'GET', httpStatusCode : response.statusCode, path : urlPath, exTime : responseTime, message : error };
                //log.log('err', logEntry);

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

        var newUrl = 'http://webapi.henley.com.au' + urlPath;
        var start = new Date();

        //Get the data posted to this body
        var options = {};
        var contentType = req.headers['content-type'];
        var data = JSON.stringify(req.body);

        if (contentType) {

            //If we got posted json - post through json
            if (contentType.indexOf('application/json') > -1) {
                // POST JSON
                //console.log('json');
                options = {
                    url: 'http://webapi.henley.com.au' + urlPath,
                    method: 'POST',
                    headers: req.headers,
                    body : data
                };
            }
            //If we got posted a form - handle it as a form and post it through accordingly
            else if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
                // POST FORM
                //console.log('form');
                options = {
                    url: 'http://webapi.henley.com.au' + urlPath,
                    method: 'POST',
                    headers: req.headers,
                    form : req.body
                };
            }
            else {
                //assume json
                //console.log('other - defaulting to json');
                options = {
                    url: 'http://webapi.henley.com.au' + urlPath,
                    method: 'POST',
                    headers: req.headers,
                    body : data
                };
            }
        }

        //console.log(options);

        request(options, function(error, response, body) {

            console.log('received response');
            //console.log(body);
            //console.log(response.headers);

            var json = {};
            var logEntry = {
                type : 'zzGeneric',
                request : {}
            };

            //Set the response to whatever we get back (include all options)
            res.set(response.headers);
            res.send(body);

            var responseTime = new Date() - start;

            if(body && body.toLowerCase().indexOf('error') > -1) {
                error = body;
            }

            var responseContentType = response.headers['content-type'];
            if(responseContentType.indexOf('application/json') > -1) {
                var json = JSON.parse(body);
                var message = (!json.ResponseMessage) ? '' : json.ResponseMessage;
                logEntry.request = { level : 'Info', date : new Date(), type : 'POST', httpStatusCode : response.statusCode, path : urlPath, exTime : responseTime, message : message };
                //log.log('info', logEntry);

                var hookOptions = {
                    url: 'https://zapier.com/hooks/catch/294068/ubqxjb',
                    method: 'POST',
                    body : JSON.stringify(logEntry.request)
                };
                request(hookOptions);
            }

            if(error) {
                logEntry.request = { level : 'Error', date : new Date(), type : 'POST', httpStatusCode : response.statusCode, path : urlPath, exTime : responseTime, message : error };
                //log.log('err', logEntry);

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

};

module.exports = zzGenericController;