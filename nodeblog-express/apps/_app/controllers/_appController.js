//NodeJS Plugins
var fs = require('fs');
var path = require('path');

//Other plugins
var requestify = require('requestify');

//app = express app
function _appController(app) {

    console.log('Loading _appController [LAST ALWAYS]');

    //init variables
    var appDir = path.dirname(require.main.filename);

    //App Custom Plugins
    var SPA = require(appDir + '/lib/SPA.js');
    var utilities = require(appDir + '/lib/utilities.js');

    function userMiddleware(req, res, next) {
        req.params.isAuthenticated = false;

        //If user is authenticated, set params 'isAuthenticated' = true
        if(req.session.username) {
            //user successfully logged in - set new request variable
            req.params.isAuthenticated = true;
        }

        //console.log('[ Authenticated = ' + req.params.isAuthenticated + ' ]');

        next();
    }

    //Express routes
    //Mail Sender
    app.post('/mail/send', function(req, res) {

        console.log('Sending Email...');

        //Your domain, from the Mailgun Control Panel
        var domain = 'mg.adamjohnstone.co';

        //Your sending email address post data
        var sender = req.body.name + ' <' + req.body.email + '>';
        var mailedFrom = 'contact@adamjohnstone.co';
        var recipients = 'ajjoh5@gmail.com';
        var message = 'Contact Details: \n' + sender + '\n\nMessage:' + req.body.message;

        var options = {
            auth: {
                username: 'api',
                password: 'key-74bcec52b1dd582c2989aec6022ce95d'
            },
            dataType: 'form-url-encoded'
        };


        var data = {
            from : mailedFrom,
            to : recipients,
            subject : 'AdamJohnstone.co - Contact Request Submitted',
            text : message
        };

        requestify.post('https://api.mailgun.net/v3/' + domain + '/messages', data, options)
            .then(function(response) {
                // Get the response body
                var body = response.getBody();
                console.log(body);

                res.send(body);
            });
    });

    //INDEX ROUTE - custom handling
    app.get('/', userMiddleware, function(req, res) {

        //Create new single page app - "pages", with default view called "default"
        req.params[0] = 'pages/about-me';
        var spa = new SPA(req.params);

        //Render the single page app from the spa params
        res.render(spa.viewFile, spa.viewParams);
    });

    // Generic Catch All SPA Views (put in last)
    app.get('/?*', userMiddleware, function(req, res) {

        //Create new single page app based on params
        var spa = new SPA(req.params);

        res.render(spa.viewFile, spa.viewParams);
    });

    //Save SPA Content
    app.post('/?*/save', userMiddleware, function(req, res) {

        //If user is authenticated, then Save the SPA
        if(req.params.isAuthenticated) {
            SPA.saveSPA(req.params, req, function(err, data) {
                res.send(data)
            });
        }
    });

}

module.exports = _appController;