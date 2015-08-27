//NodeJS Plugins
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

//Controller Plugins
var bcrypt = require('bcrypt-nodejs');
var session = require('express-session');

function _loginController(app) {

    console.log('Loading APP Controller [_loginController]');

    //TODO: Add in ability to save login creds, update login creds to json file, store session name/secret in settings file

    //init variables
    var appDir = path.dirname(require.main.filename);

    //Get all Login Settings from login.json file
    var data = fs.readFileSync(__dirname + '/../data/login.json', 'utf8');
    var appConfig = JSON.parse(data);
    var sessionSettings = _.findWhere(appConfig.nodes, {name: 'session-settings'});
    var appSessionSecret = _.findWhere(sessionSettings.properties, {name : 'session-secret'}).value;
    var appSessionName = _.findWhere(sessionSettings.properties, {name : 'session-name'}).value;

    //Setup sessions with config as follows
    app.use(session({
        secret: appSessionSecret,
        name: appSessionName,
        proxy: true,
        resave: true,
        saveUninitialized: true
    }));

    function findUser(inputUsername) {
        //get all users
        var allUsers = _.findWhere(appConfig.nodes, {name : 'login-users'});

        //get user by username
        var user = _.findWhere(allUsers.users, {username : inputUsername});

        return user;
    }

    function generateHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }

    function isValidPassword(inputUsername, inputPassword) {
        var isValid = false;

        var user = findUser(inputUsername);

        if(user) {
            isValid = bcrypt.compareSync(inputPassword, user.password);
        }

        return isValid;
    }

    //Post - Login Credentials to Nodeblog
    app.get('/login', function(req, res) {
        res.render(appDir + '/apps/_app/views/login', { layout : appDir + '/apps/_app/views/layouts/login-layout'});
    });

    app.post('/login', function(req, res) {

        if(isValidPassword(req.body.email, req.body.password))
        {
            //Save username 'email' as valid login session
            req.session.username = req.body.email;
            res.redirect('/');
        }
        else
        {
            res.redirect('/login');
        }
    });

    //Post - Login Credentials to Nodeblog
    app.get('/logout', function(req, res) {

        req.session.destroy(function(err) {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect('/');
            }
        });

    });

};

module.exports = _loginController;