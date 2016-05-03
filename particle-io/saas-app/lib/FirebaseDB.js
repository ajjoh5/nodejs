var FirebaseDB = function(options) {

    var Firebase = require('firebase');
    var firebaseURL = global.__settings.firebase.url;
    var ref = new Firebase(firebaseURL);
    var authData = ref.getAuth();

    var user = {
        email: global.__settings.firebase.email,
        password: global.__settings.firebase.password
    };

    var isAuthDataExpired = function() {
        var retval = false;
        //Get current epoch time, with no milliseconds (divide by 1000 to get this)
        //to make number the same format as firebase
        var currentTime = Math.floor(Date.now() / 1000);

        //Check if token is expired (or about to expire in 10 seconds.. hence the 10)
        if(authData && authData.expires < (currentTime + 10)) {
            retval = true;
        }

        return retval;
    };

    var initDB = function(callback) {

        //If auth data is expired - reset and get another token
        if(isAuthDataExpired()) {
            authData = null;
        }

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