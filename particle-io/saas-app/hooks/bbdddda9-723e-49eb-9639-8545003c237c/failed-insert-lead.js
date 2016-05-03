var hook = function(options) {

    var insert = options.insert;
    var _ = require('underscore');
    var format = require('string-format');

    //mailgun settings
    var api_key = global.__settings.mailgun.apiKey;
    var domain = global.__settings.mailgun.domain;
    var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

    //Twilio Credentials
    var accountSid = global.__settings.twilio.accountSid;
    var authToken = global.__settings.twilio.authToken;

    //require the Twilio module and create a REST client
    var client = require('twilio')(accountSid, authToken);

    var unrequire = function(fileString) {
        console.log('Permission denied. Require is not supported.');
    };

    return {

        execute : function(callback) {
            try {

                if(insert.__type == 'error') { console.log('error inserting lead');}

                return callback(null, true);
            }
            catch(err) {
                return callback(err, false);
            }
        }

    }
};

module.exports.create = function(options) {
    return new hook(options);
};
