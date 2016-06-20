var ParticleIO = function(options) {

    var request = require('request');
    var authtoken = (!options.authtoken) ? '' : options.authtoken;

    //File based winston logging
    var logger = require('../lib/winston-logger.js');

    return {

        new : function(particle, callback) {

            var logType = (!particle.__type) ? 'info' : particle.__type;
            logger.log(logType, '', { particle : particle });

            var options = {
                url: 'http://162.243.104.143/api/particles/new',
                method: 'POST',
                json : true,
                body : particle,
                headers : {
                    'authorization' : 'Bearer ' + authtoken
                }
            };

            request(options, function(error, response, body) {
                //If we had an error logging, then write file log
                if(response.statusCode == 200) {
                    return callback(null, body);
                }
                else {
                    var err = error;
                    if(body) {err = body}
                    return callback(err, null);
                }
            });
        },

        findByGroup : function(group, callback) {
            var options = {
                url: 'http://162.243.104.143/api/particles/' + group,
                method: 'GET',
                headers : {
                    'authorization' : 'Bearer ' + authtoken
                }
            };

            request(options, function(error, response, body) {
                //If we had an error logging, then write file log
                if(response.statusCode == 200) {
                    return callback(null, JSON.parse(body));
                }
                else {
                    var err = error;
                    if(body) {err = body}
                    return callback(err, null);
                }
            });
        }

    }
};

module.exports.create = function(options) {
    return new ParticleIO(options);
};