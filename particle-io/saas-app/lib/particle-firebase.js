var ParticleFirebase = function(options) {

    //init plugins
    var dateFormat = require('dateformat');
    var _ = require('underscore');
    var db = require('./FirebaseDB.js').createDB();

    var getUserByKeytoken = function(keytoken, ref, callback) {

        var users = ref.child('users');
        users.once("value", function(data) {

            var users = data.val();

            var user = _.find(users, function(item) {
                return item.keytoken == keytoken
            });

            if(!user) {
                return callback('No user found for keytoken: ' + keytoken, null);
            }

            return callback(null, user);

        }, function (error) {
            return callback(error, null)
        });
        
    };

    return {

        insertParticle : function(keytoken, particle, callback) {

            if(!particle) {
                return callback('particle was null.', null);
            }

            if(!keytoken) {
                return callback('keytoken was null.', null);
            }

            //Setup particle
            var newParticle = {
                group : (!particle.group) ? 'default' : particle.group,
                created : dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT'),
                type : (!particle.type) ? 'info' : particle.type,
                particle : particle
            };

            delete newParticle.particle.group;
            delete newParticle.particle.type;

            db.init(function(err, ref) {

                //Ensure user keytoken is valid
                getUserByKeytoken(keytoken, ref, function(err, user) {

                    if(err) {
                        return callback(err, null);
                    }

                    var particles = ref.child(user.userid + '/particles');

                    particles.push(newParticle, function(error) {
                        if(!error) {
                            return callback(null, newParticle);
                        }
                        else {
                            return callback(error, null);
                        }
                    });
                });
            });

        }

    }
};

module.exports.createDB = function(options) {
    return new ParticleFirebase(options);
};