var Hapi = require('hapi');
var Path = require('path');
var _ = require('underscore');
var fs = require('fs');
var requestify = require('requestify');


//Register Handlebars, Handlebars Layouts
var handlebars = require('handlebars');
var layouts = require('handlebars-layouts');
layouts.register(handlebars);


// Create a server with a host and port
//var server = new Hapi.Server();
//server.connection({
//    host: 'localhost',
//    port: 8000,
//    router: {
//        stripTrailingSlash: true
//    }
//});

var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

server.views({
    engines: {
        html: handlebars
    },
    path: Path.join(__dirname, 'views'),
    partialsPath: Path.join(__dirname, 'templates/partials')
});

server.ext('onRequest', function(request, reply) {
    //Add a trailing '/' onto every request
    //var path = request.path;
    //if (path.substr(path.length - 1, 1) !== '/' && path.indexOf('.') === -1) {
    //    //console.log(path.indexOf('.'));
    //    request.path = request.path + '/';
    //}


    console.log('Caught Request : ' + request.path);
    return reply.continue();
});

//Handle Index route
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.redirect('/pages/home');
    }
});

server.route({
    method: 'GET',
    path: '/blog',
    handler: function (request, reply) {
        reply.redirect('/blog/');
    }
});

server.route({
    method: 'GET',
    path: '/{app}/{route*}',
    handler: function (request, reply) {

        console.log(request.params);

        var routeVars = {
            app : 'pages',
            route : 'home'
        };

        if (request.params['app']) {
            //var routeList = request.params['route'].split('/');
            //console.log(routeList);
            //routeVars.route = routeList[1];
            routeVars.app = request.params['app'];
            if(request.params['route']) {
                routeVars.route = request.params['route'];
            }
        }

        console.log('Serving Route with Vars: ' + JSON.stringify(routeVars));


        reply.view(routeVars.app, {
            brand : 'Adam Johnstone',
            pageTitle : 'Adam Johnstone | A disruptive tech innovator, entrepreneur and business owner located in Melbourne, Australia. Coder age 13, and disruptive by nature.'
        });
    }
});

// Send Email through Email Route
server.route({
    method: 'POST',
    path: '/mail/send',
    handler: function (request, reply) {
        console.log('Sending Email...');

        //Your domain, from the Mailgun Control Panel
        var domain = 'mg.adamjohnstone.co';

        //Your sending email address post data
        var sender = request.payload.name + ' <' + request.payload.email + '>';
        var mailedFrom = 'contact@adamjohnstone.co';
        var recipients = 'ajjoh5@gmail.com';
        var message = 'Contact Details: \n' + sender + '\n\nMessage:' + request.payload.message;

        var options = {
            auth: {
                username: 'api',
                password: 'key-74bcec52b1dd582c2989aec6022ce95d'
            },
            dataType: 'form-url-encoded'
        }



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

            reply(body);
        });
    }
});


/* ALL FILE ROUTES */

server.route({
    method: 'GET',
    path: '/{app}/css/{filename}',
    handler: {
        file: function (request) {
            return request.params.app + '/css/' + request.params.filename;
        }
    }
});

server.route({
    method: 'GET',
    path: '/{app}/images/{filename}',
    handler: {
        file: function (request) {
            return request.params.app + '/images/' + request.params.filename;
        }
    }
});

server.route({
    method: 'GET',
    path: '/{app}/pages/{filename}',
    handler: {
        file: function (request) {
            return request.params.app + '/pages/' + request.params.filename;
        }
    }
});

server.route({
    method: 'GET',
    path: '/js/{path*}',
    handler: {
        directory: {
            path: './js'
        }
    }
});

server.route({
    method: 'GET',
    path: '/{app}/app.js',
    handler: {
        file: function (request) {
            return request.params.app + '/app.js';
        }
    }
});

// Start the server
server.start(function () {
    console.log('Server running at:', server.info.uri);
});
