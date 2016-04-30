var hook1 = function(options) {

    var insert = options.insert;
    var _ = require('underscore');
    var format = require('string-format');
    var api_key = 'key-74bcec52b1dd582c2989aec6022ce95d';
    var domain = 'sandbox65ed4cdf4db643d2bf73f1bb9ee348c4.mailgun.org';
    var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
    
    return {

        execute : function(callback) {
            try {

                if(insert.__type == 'error') {
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
