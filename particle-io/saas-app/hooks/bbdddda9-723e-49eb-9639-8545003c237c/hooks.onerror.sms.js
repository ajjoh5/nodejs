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

                var text = format('* Lead with details not submitted. *\n\nCreated: {0}\nLead:\n{1}',
                    insert.__created,
                    JSON.stringify(insert.particle.lead, null, '\t'));

                var data = {
                    from: 'Particle.io ALerts <noreply@samples.mailgun.org>',
                    to: 'ajjoh5@gmail.com',
                    subject: 'Particle.io - Lead Insert Error',
                    text: text
                };

                mailgun.messages().send(data, function (error, body) {
                    console.log(body);
                });

                client.messages.create({
                    to: "+61419301453",
                    from: "+61427075003",
                    body: "Lead insert error. Lead details [http://p-io?id=176523asd]"
                }, function(err, message) {
                    console.log(message.sid);
                });

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
