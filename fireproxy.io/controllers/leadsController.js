var leadsController = function(app) {

    console.log('> leadsController.js');

    var url = require('url');

    app.post('/create', function(req, res, next) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;
        var message = '';

        //Log lead to fireproxy.io first!
        var logEntry = {
            type: 'info',
            group: 'manual.lead',
            handler : 'leadsController.js',
            httpMethod : 'post',
            httpStatusCode : 200,
            path : urlPath,
            exTime : 1,
            message : message,
            lead : req.body
        };

        req.logEntry = logEntry;

        next();
    });

    app.post('/createformlead', function(req, res, next) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;
        var message = '';

        //Log lead to fireproxy.io first!
        var logEntry = {
            type: 'info',
            group: 'form.lead',
            handler : 'leadsController.js',
            httpMethod : 'post',
            httpStatusCode : 200,
            path : urlPath,
            exTime : 1,
            message : message,
            lead : req.body
        };

        req.logEntry = logEntry;

        next();
    });

    app.post('/createjsonlead', function(req, res, next) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;
        var message = '';

        //Log lead to fireproxy.io first!
        var logEntry = {
            type: 'info',
            group: 'json.lead',
            handler : 'leadsController.js',
            httpMethod : 'post',
            httpStatusCode : 200,
            path : urlPath,
            exTime : 1,
            message : message,
            lead : req.body
        };

        req.logEntry = logEntry;

        next();
    });

    app.post('/createjsonlead2', function(req, res, next) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;
        var message = '';

        //Log lead to fireproxy.io first!
        var logEntry = {
            type: 'info',
            group: 'json.lead',
            handler : 'leadsController.js',
            httpMethod : 'post',
            httpStatusCode : 200,
            path : urlPath,
            exTime : 1,
            message : message,
            lead : req.body
        };

        req.logEntry = logEntry;

        next();
    });
};

module.exports = leadsController;