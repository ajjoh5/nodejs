var hook1 = function(options) {

    var insert = options.insert;
    var _ = require('underscore');
    var format = require('string-format');
    var api_key = 'key-';
    var domain = '.mailgun.org';
    var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
    // Twilio Credentials
    var accountSid = '';
    var authToken = '';

    //require the Twilio module and create a REST client
    var client = require('twilio')(accountSid, authToken);

    return {

        execute : function(callback) {
            try {

                if(insert.particle.item.priority == 1) {
                    var text = format('* Lead with details not submitted. *\n\nCreated: {0}\nLead:\n{1}',
                        insert.__created,
                        JSON.stringify(insert.particle.lead, null, '\t'));

                    var data = {
                        from: 'Excited User <me@samples.mailgun.org>',
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
                        body: "Heart Ornament Priority Shipping! Click here to dispatch [https://igenius.agilecrm.com/#contacts]",
                    }, function(err, message) {
                        console.log(message.sid);
                    });
                }

                return callback(null, true);
            }
            catch(err) {
                return callback(err, false);
            }
        }

    }
};

module.exports.create = function(options) {
    return new hook1(options);
};
