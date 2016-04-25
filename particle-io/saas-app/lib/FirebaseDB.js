var FirebaseDB = function(options) {

    var Firebase = require('firebase');
    var firebaseURL = 'https://amber-heat-6552.firebaseio.com/particle-io';
    var ref = new Firebase(firebaseURL);
    var authData = ref.getAuth();
    var user = {
        email: 'ajjoh5@gmail.com',
        password: 'jabronie'
    };

    var initDB = function(callback) {
        //Get auth on db & set session
        if (authData) {
            //console.log("ALREADY LOGGED IN - User " + authData.uid + " is logged in with " + authData.provider);
            return callback(null, ref);
        }
        else {
            //User not auth'd yet - auth them.. then push new particle
            ref.authWithPassword(user, function(error, data) {
                if (!error) {
                    //console.log("User " + data.uid + " is logged in with " + data.provider);
                    authData = data;
                    return callback(null, ref);
                }
                else {
                    console.log(error);
                    return callback(error, null);
                }
            });
        }
    };

    return {

        init : function(callback) {
            return initDB(callback);
        }

    }
};

module.exports.createDB = function(options) {
    return new FirebaseDB(options);
};