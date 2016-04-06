var leadsController = function(app) {

    var request = require('request');
    var url = require('url');
    var format = require('string-format');
    var Logger = require('le_node');
    var log = new Logger({
        token:'3ee89457-5668-4059-a70f-0fab020dd373'
    });

    app.get('/jobapi/leads/GetRegions', function(req, res) {
        //params - (string keytoken, string brandID)

        var urlParts = url.parse(req.url, true);
        console.log(urlParts);
        var urlPath = urlParts.path;
        var newUrl = 'http://webapi.henley.com.au' + urlPath;
        var start = new Date();

        //Time how long url takes to serve
        //console.time(format('[v1 - default route - {0}]', urlPath));

        request(newUrl, function(error, response, body) {

            var json = {};

            if (!error && response.statusCode == 200) {
                json = JSON.parse(body);
                res.json(json);
            }

            var logEntry = {
                type : 'GetRegions',
                request : {},
                response : {
                    regionCount : json.length
                }
            };

            var responseTime = new Date() - start;

            if(!error && response.statusCode == 200) {
                var message = (!json.ResponseMessage) ? '' : json.ResponseMessage;
                logEntry.request = { httpStatusCode : response.statusCode, path : urlPath, exTime : responseTime, message : message };
                log.log('info', logEntry);
            }

            if(error) {
                logEntry.request = { httpStatusCode : response.statusCode, path : urlPath, exTime : responseTime, message : message };
                log.log('err', logEntry);
            }

            //console.timeEnd(format('[v1 - default route - {0}]', urlPath));

        });
    });
}
module.exports = leadsController;