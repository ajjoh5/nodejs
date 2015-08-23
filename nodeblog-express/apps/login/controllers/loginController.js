//NodeJS Plugins
var path = require('path');

//Controller Plugins
var bcrypt = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;


function loginController(app) {

    //init variables
    var appDir = path.dirname(require.main.filename);

    //App Custom Plugins
    var SPA = require(appDir + '/lib/SPA.js');
    var utilities = require(appDir + '/lib/utilities.js');

    function generateHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }

    function isValidPassword(inputPassword, storedPassword) {
        return bcrypt.compareSync(inputPassword, storedPassword);
    }

    function findUser(inputUsername) {

    }

    ////Login to Nodeblog
    //app.post('/login', function(req, res) {
    //
    //    //hash version of 'password'
    //    var storedPassword = '$2a$08$i3y12yfo0T1Rw9mjbVxBiO93nf8L5VrTb8eF3RsVuvxHwhsVueBfK';
    //
    //    if(isValidPassword(req.body.password, storedPassword))
    //    {
    //        console.log('login success');
    //    }
    //
    //    res.send(JSON.stringify(req.body));
    //});

    app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.findOne({ username: username }, function (err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (!user.validPassword(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        }
    ));

};

module.exports = loginController;