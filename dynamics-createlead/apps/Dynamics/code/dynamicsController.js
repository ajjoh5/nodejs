//Reboot Plugins
var rebootUtilities = require(__base + 'lib/reboot-js/reboot-utilities');
var _ = require('underscore');
var Q = require('q');

var dynamicsController = function(app) {

    var baseAPIUrl = 'http://webapi.henley.com.au/jobapi/';

    var error = {
        "code": 0,
        "message": "string"
    };

    //app.get('/v2/CRM/CreateLead', function(req, res) {
    //   res.send('/v2/CRM/CreateLead');
    //});

    // Generic Catch All SPA Views (put in last)
    app.post('/v2/CRM/CreateLead', function(req, res) {

        var keytoken = req.query.keytoken;
        var lead = req.body;

        if(!keytoken || keytoken != '616c6c6f6361746564206c65616473206b6579') {
            error.code = '-1';
            error.message = 'Keytoken invalid.';

            res.status(401).send(error);
        }
        else {
            try {

                //Validate that lead has firstname / lastname / email / mobile phone / subject
                if(lead && lead.FirstName && lead.LastName && lead.Email && lead.MobilePhone && lead.Subject) {

                    //Remap Mobile to MobilePhone
                    lead.Mobile = lead.MobilePhone;
                    //console.log(lead);

                    //If environment is dev - just pass back the lead, otherwise post it to production
                    if(process.env.NODE_ENV = 'production') {

                        //Post the lead
                        postLead(lead)
                        .then(function(data) {
                            res.status(200).send(lead);

                        }, function(err) {
                            //throw error if received
                            error.code = '-1';
                            error.message = err;
                            res.status(520).send(error);
                        });
                    }
                    else {
                        res.status(200).send(lead);
                    }

                }
                else {
                    throw 'Lead object was either missing important fields or not detected in post call.'
                }
            }
            catch(ex) {
                error.code = '-1';
                error.message = ex;
                res.status(520).send(error);
            }

        }
    });

    function postLead(lead, callback) {
        var request = require('request');
        var d = Q.defer();

        // Set the headers
        var headers = {
            'User-Agent': 'Super Agent/0.0.1',
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        // Configure the request
        var options = {
            url: baseAPIUrl + 'leads/CreateNewFormLead?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461',
            method: 'POST',
            headers: headers,
            form: lead
        };

        // Start the request
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                d.resolve(body);
            }
            else {
                d.reject('Could not add lead to staging table. Please contact IT Support to track issue.');
            }
        });

        return d.promise;
    }
}

module.exports = dynamicsController;