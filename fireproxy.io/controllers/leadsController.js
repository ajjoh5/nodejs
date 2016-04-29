var leadsController = function(app) {

    console.log('> leadsController.js');

    var url = require('url');
    var bodyParser = require('body-parser');

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.post('/CreateNew', function(req, res, next) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;
        var message = '';

        //Log lead to fireproxy.io first!
        var logEntry = {
            type: 'info',
            group: 'manual.lead',
            handler : 'leadsController',
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