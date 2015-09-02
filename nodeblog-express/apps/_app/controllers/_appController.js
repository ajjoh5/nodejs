//NodeJS Plugins
var fs = require('fs');
var path = require('path');

//Other plugins
var requestify = require('requestify');

//app = express app
function _appController(app) {

    //init variables
    var appDir = path.dirname(require.main.filename);

    //App Custom Plugins
    var SPA = require(appDir + '/lib/SPA.js');
    var spav2 = require(appDir + '/lib/spav2.js');
    var utilities = require(appDir + '/lib/utilities.js');

    function newSPA() {
        var sid = utilities.generateShortID();

        //Class Template
        return {
            name : 'New SPA ID - ' + sid,
            url : 'new-spa-' + sid,
            contents: [
                {
                    name: "content",
                    value: ""
                }
            ],
            properties : [
                {
                    "name": "meta-description",
                    "description": "The meta-description must contain the primary keyword / phrase and be no longer than 156 characters",
                    "value": "meta-description here"
                },
                {
                    "name": "page-title",
                    "description": "The page title must contain the primary keyword / phrase and be no longer than 70 characters",
                    "value": "New Node ID - " + sid
                },
                {
                    name: "more-text",
                    value: "more text here"
                },
                {
                    name: "featured-image",
                    value: "http://image"
                },
                {
                    name: "author",
                    value: "Admin"
                },
                {
                    name: "publish-date",
                    value: utilities.formatDate(new Date())
                }
            ]
        };
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
    app.get('/', utilities.cmsMiddleware, function(req, res) {

        var app = {
            name : 'pages',
            view : 'about-me',
            params : req.params
        };

        var viewParams = spav2.initSPA(app);

        res.render(app.viewFile, viewParams);
    });

    var appDir = path.dirname(require.main.filename);

    // Generic Catch All SPA Views (put in last)
    app.get('/?*', utilities.cmsMiddleware, function(req, res) {

        var urlParams = utilities.removeLastSlash(req.params[0]).split('/');

        var app = {
            name : urlParams[0],
            view : urlParams[1],
            params : req.params
        };

        var viewParams = spav2.initSPA(app);

        res.render(app.viewFile, viewParams);
    });

    //Save SPA Content
    app.post('/?*/save', utilities.cmsMiddleware, function(req, res) {

        if (process.env.NODE_ENV == 'development' ) { console.log('[ Save - POST ]'); console.log(JSON.stringify(req.body)); }
        var urlParams = utilities.removeLastSlash(req.params[0]).split('/');

        var app = {
            name : urlParams[0],
            view : urlParams[1],
            params : req.params
        };

        //init spa
        spav2.initSPA(app);

        //If user is authenticated, then Save the SPA
        if(req.params.isAuthenticated) {
            spav2.saveSPA(app, req, function(err, data) {
                console.log(data);
                res.send(data)
            });
        }
        else {
            console.log('Not saved');
            res.send('Not saved');
        }
    });

    //New SPA Content
    app.post('/?*/new', utilities.cmsMiddleware, function(req, res) {

        //var urlParams = utilities.removeLastSlash(req.params[0]).split('/');
        //
        ////If user is authenticated, then create new SPA and Save it
        //if(req.params.isAuthenticated) {
        //    SPA.newSPA(urlParams[0], urlParams[1], null, req.params, req, function(err, data) {
        //        res.send(data)
        //    });
        //}

        var nSPA = newSPA();
        var urlParams = utilities.removeLastSlash(req.params[0]).split('/');

        var app = {
            name : urlParams[0],
            view : nSPA.url,
            params : req.params
        };

        //init spa
        spav2.initSPA(app);

        //Save the new blog and redirect to it
        spav2.newSPA(app, blog, function(err, data) {
            res.redirect(app.view);
        });
    });

}

module.exports = _appController;