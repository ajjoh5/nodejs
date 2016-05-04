var test = function(options) {

    return {

        execute : function(req) {

            var url = require('url');
            var urlParts = url.parse(req.url, true);
            var urlPath = urlParts.path;

            var message = '';

            var logEntry = {
                type: 'info',
                group: 'manual.lead-2',
                handler : 'test.js',
                httpMethod : 'post',
                httpStatusCode : 200,
                path : urlPath,
                exTime : 1,
                message : message,
                lead : req.body
            };

            req.logEntry = logEntry;

            return req;
        }

    }
};

module.exports.create = function(options) {
    return new test(options);
};