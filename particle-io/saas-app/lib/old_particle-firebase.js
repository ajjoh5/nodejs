var Q = require('q');
var format = require('string-format');
var _ = require('underscore');
var Firebase = require('firebase');

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

    this.firebaseURL = format('https://amber-heat-6552.firebaseio.com/{0}', this.userspace);
    this.ref = new Firebase(this.firebaseURL);
};


ParticleFirebase.prototype.GetAuth = function() {

    var deferred = Q.defer();

    //Check if authdata already exists
    var authData = this.ref.getAuth();
    if (authData) {
        console.log("ALREADY LOGGED IN - User " + authData.uid + " is logged in with " + authData.provider);
        console.log(this.authData);
        this.authData = authData;
        deferred.resolve(authData);
    }
    else {
        //User not auth'd yet - auth them.. then push new particle
        this.ref.authWithPassword(this.user, function(error, authData) {
            if (!error) {
                console.log(this.authData);
                console.log("User " + authData.uid + " is logged in with " + authData.provider);
                this.authData = authData;
                deferred.resolve(authData);
            }
            else {
                console.log(error);
                deferred.reject(error);
            }
        });
    }

    return deferred.promise;
};

ParticleFirebase.prototype.Insert = function(particle) {

    var deferred = Q.defer();

    if(particle) {

        this.GetAuth().then(function(authData) {
            //if user auth'd in session - just push new particle
            var particles = this.ref.child('particles');

            particles.push(particle, function(error) {
                if(error) {
                    deferred.reject(error);
                }
                else {
                    deferred.resolve(particle);
                }
            });
        });
    }

    return deferred.promise;
};

ParticleFirebase.prototype.GetUserByKey = function(keytoken) {

    var deferred = Q.defer();

    if(keytoken) {

        this.GetAuth().then(function(authData) {

            var firebaseURL = format('https://amber-heat-6552.firebaseio.com/ajjoh5/users');
            var ref = new Firebase(firebaseURL);

            ref.once("value", function(data) {

                var users = data.val();

                var user = _.find(users, function(item) {
                    return item.keytoken == keytoken
                });

                if(user) {
                    //return null or the user obj
                    deferred.resolve(user);
                }
                else {
                    //keytoken supplied not valid
                    deferred.reject("Error - Keytoken was incorrect.");
                }

            }, function (error) {
                console.log('data error');
                deferred.reject("The read failed for keytoken: " + error.code);
            });
        });
    }
    else
    {
        deferred.reject("Error - Keytoken not supplied or null.");
    }

    return deferred.promise;
};

module.exports = ParticleFirebase;