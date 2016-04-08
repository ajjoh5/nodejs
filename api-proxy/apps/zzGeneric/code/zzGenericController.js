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
        token:'3ee89457-5668-4059-a70f-0fab020dd373'
    });

    // Generic Catch All - GET METHOD
    app.get('/?*', function(req, res) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;
        var newUrl = 'http://webapi.henley.com.au' + urlPath;
        var start = new Date();

        //Time how long url takes to serve
        //console.time(format('[v1 - default route - {0}]', urlPath));

        request.get(newUrl, function(error, response, body) {

            var json = {};
            var logEntry = {
                type : 'zzGeneric',
                request : {}
            };

            if (!error && response.statusCode == 200) {
                json = JSON.parse(body);
                res.json(json);
            }

            var responseTime = new Date() - start;

            if(!error && response.statusCode == 200) {
                var message = (!json.ResponseMessage) ? '' : json.ResponseMessage;
                logEntry.request = { type : 'get', httpStatusCode : response.statusCode, path : urlPath, exTime : responseTime, message : message };
                log.log('info', logEntry);
            }

            if(error) {
                logEntry.request = { type : 'get', httpStatusCode : response.statusCode, path : urlPath, exTime : responseTime, message : error };
                log.log('err', logEntry);
            }

            //console.timeEnd(format('[v1 - default route - {0}]', urlPath));
            
        });
    });

    // Generic Catch All - GET METHOD
    app.post('/?*', function(req, res) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;

        var newUrl = 'http://webapi.henley.com.au' + urlPath;
        var start = new Date();

        //Get the data posted to this body
        console.log(req.headers);
        var data = JSON.stringify(req.body);

        // POST JSON
        // var options = {
        //     url: 'http://webapi.henley.com.au' + urlPath,
        //     method: 'POST',
        //     //headers: {'Content-Type' : 'application/json'},
        //     headers: req.headers,
        //     body : data
        // };

        //POST FORM OBJECT
        var options = {
            url: 'http://localhost:64444' + urlPath,
            method: 'POST',
            headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
            headers: req.headers,
            form : req.body
        };

        console.log(options);

        request(options, function(error, response, body) {

            console.log('received response');
            console.log(body);
            console.log(response.headers);

            var json = {};
            var logEntry = {
                type : 'zzGeneric',
                request : {}
            };

            if (!error && response.statusCode == 200) {
                json = JSON.parse(body);
                res.json(json);
            }

            var responseTime = new Date() - start;

            if(body && body.toLowerCase().indexOf('error') > -1) {
                error = body;
            }

            if(!error && response.statusCode == 200) {
                var message = (!json.ResponseMessage) ? '' : json.ResponseMessage;
                logEntry.request = { type : 'post', httpStatusCode : response.statusCode, path : urlPath, exTime : responseTime, message : message };
                log.log('info', logEntry);
            }

            if(error) {
                logEntry.request = { type : 'post', httpStatusCode : response.statusCode, path : urlPath, exTime : responseTime, message : error };
                log.log('err', logEntry);
            }

        });
    });

};

module.exports = zzGenericController;