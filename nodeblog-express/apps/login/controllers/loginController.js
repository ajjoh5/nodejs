//NodeJS Plugins
var path = require('path');

//Controller Plugins
var bcrypt = require('bcrypt-nodejs');
var session = require('express-session');

function loginController(app) {

    //init variables
    var appDir = path.dirname(require.main.filename);

    var appSessionSecret = 'app secret here';
    var appSessionName = 'nodeblog-express';

    //Setup sessions inside app
    //app.use(session({secret: 'secret-here'}));
    app.use(session({
        secret: appSessionSecret,
        name: appSessionName,
        proxy: true,
        resave: true,
        saveUninitialized: true
    }));

    function generateHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }

    function isValidPassword(inputPassword, storedPassword) {
        return bcrypt.compareSync(inputPassword, storedPassword);
    }

    //Post - Login Credentials to Nodeblog
    app.post('/login', function(req, res) {

        //hash version of 'password'
        var storedPassword = '$2a$08$i3y12yfo0T1Rw9mjbVxBiO93nf8L5VrTb8eF3RsVuvxHwhsVueBfK';

        if(isValidPassword(req.body.password, storedPassword))
        {
            //Save username 'email' as valid login session
            req.session.username = req.body.email;
            res.redirect('/');
        }
        else
        {
            res.redirect('/login');
        }

        //res.send(JSON.stringify(req.body));
    });

    //Post - Login Credentials to Nodeblog
    app.get('/logout', function(req, res) {

        req.session.destroy(function(err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(req.session);
                res.redirect('/');
            }
        });

    });

};

module.exports = loginController;