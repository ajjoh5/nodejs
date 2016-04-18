var leadsController = function(app) {

    var request = require('request');
    var url = require('url');
    var format = require('string-format');
    var bodyParser = require('body-parser');
    var dateFormat = require('dateformat');

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.post('/CreateNew', function(req, res) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;

        console.log(req.body);

        //Log lead to spreadsheet first!
        var logLeadEntry = {
            date : dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT'),
            path : urlPath,
            leadJSON : JSON.stringify(req.body)
        };

        //console.log(logLeadEntry);

        var hookOptions = {
            url: 'https://zapier.com/hooks/catch/294068/u2lplt/',
            method: 'POST',
            json: true,
            body : logLeadEntry
        };
        request(hookOptions);
    });

};

module.exports = leadsController;