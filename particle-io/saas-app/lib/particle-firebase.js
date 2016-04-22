var Q = require('q');
var format = require('string-format');
var _ = require('underscore');

// "particles": {
//     // grants read access to any user who is logged in with an email and password
//     ".write": "auth !== null && auth.provider === 'password'",
//         // grants read access to any user who is logged in with an email and password
//         ".read": "auth !== null && auth.provider === 'password'"
// }

var ParticleFirebase = function(options) {

    //Admin user account
    this.user = {
        email: 'ajjoh5@gmail.com',
        password: 'jabronie'
    };

    this.userspace = 'ajjoh5';

    if(options) {
        this.user = (!options.user) ? this.user : options.user;
    }
};

ParticleFirebase.prototype.Insert = function(particle) {

    var deferred = Q.defer();

    if(particle) {

        var Firebase = require('firebase');
        var firebaseURL = format('https://amber-heat-6552.firebaseio.com/{0}', this.userspace);
        var ref = new Firebase(firebaseURL);
        var particles = ref.child('particles');

        var authData = ref.getAuth();
        if (authData) {
            //if user auth'd in session - just push new particle
            particles.push(particle, function(error) {
                if(error) {
                    deferred.reject(error);
                }
                else {
                    deferred.resolve(particle);
                }
            });
        }
        else {
            //User not auth'd yet - auth them.. then push new particle
            ref.authWithPassword(this.user, function(error, authData) {
                if (!error) {
                    console.log("User " + authData.uid + " is logged in with " + authData.provider);
                    particles.push(particle, function(error) {
                        if(error) {
                            deferred.reject(error);
                        }
                        else {
                            deferred.resolve(particle);
                        }
                    });
                }
            });
        }
    }

    return deferred.promise;
};

ParticleFirebase.prototype.GetUserByKey = function(keytoken) {

    var deferred = Q.defer();

    if(keytoken) {

        var Firebase = require('firebase');
        var firebaseURL = 'https://amber-heat-6552.firebaseio.com/users';
        var ref = new Firebase(firebaseURL);

        var authData = ref.getAuth();
        if (authData) {
            ref.once("value", function(data) {

                var users = data.val();
                console.log(users);

                var user = _.find(users, function(item) {
                    console.log(item);
                    return item.keytoken == keytoken
                });
                console.log(user);

                //return null or the user obj
                deferred.resolve(user);

            }, function (error) {
                deferred.reject("The read failed: " + error.code);
            });
        }
        else {
            //User not auth'd yet - auth them.. then push new particle
            ref.authWithPassword(this.user, function(error, authData) {
                if (!error) {
                    console.log("User " + authData.uid + " is logged in with " + authData.provider);

                    ref.once("value", function(data) {

                        var users = [];
                        data.forEach(function(user) {
                            // console.log(user.key());
                            // console.log(user.val());
                            users.push(user.val());
                        });

                        //make sure to include html encoding for double //
                        var user = _.find(users, function(item) {
                            return item.keytoken == keytoken
                        });

                        //return null or the user obj
                        deferred.resolve(user);

                    }, function (error) {
                        deferred.reject("The read failed: " + error.code);
                    });
                }
            });
        }
    }

    return deferred.promise;
};

module.exports = ParticleFirebase;