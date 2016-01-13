//Reboot Plugins
var rebootUtilities = require(__base + 'lib/reboot-js/reboot-utilities');
var _ = require('underscore');

var dynamicsController = function(app) {

    var nodesHTML = '';

    var error = {
        "code": 0,
        "message": "string"
    };

    // Generic Catch All SPA Views (put in last)
    app.post('/api/v1/dynamics/CreateLead', function(req, res) {

        var keytoken = req.query.keytoken;
        var lead = req.body.lead;

        //console.log(req.query);
        //console.log(req.params);
        //console.log(req.body);

        if(!keytoken || keytoken != '616c6c6f6361746564206c65616473206b6579') {
            error.code = '-1';
            error.message = 'Keytoken invalid.';

            res.status(401).send(error);
        }
        else {
            try {

                if(lead) {
                    res.status(200).send(lead);
                }
                else {
                    throw 'Lead object was not detected in post call.'
                }
            }
            catch(ex) {
                error.code = '-1';
                error.message = ex;
                res.status(520).send(error);
            }

        }
    });
}

module.exports = dynamicsController;