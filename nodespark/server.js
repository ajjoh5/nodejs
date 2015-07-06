var Hapi = require('hapi');
var Path = require('path');

//Register Handlebars, Handlebars Layouts
var handlebars = require('handlebars');
var layouts = require('handlebars-layouts');
layouts.register(handlebars);


// Create a server with a host and port
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

server.route({
    method: 'GET',
    path: '/{route*}',
    handler: function (request, reply)
    {
        var appName = 'home';

        if(request.params.route)
        {
            var routeList = request.params.route.split('/');
            appName = routeList[0];
        }

        console.log('Serving AppName: ' + appName);


        reply.view(appName,
        {
            title: 'NodeFire.io',
            appTitle : 'NodeFire.io | My Nodes'
        });
    }
});

server.route({
    method: 'GET',
    path: '/my-nodes',
    handler: function (request, reply)
    {
        reply.view('mynodes',
        {
            title: 'NodeFire.io',
            appTitle : 'NodeFire.io | My Nodes'
        });
    }
});

// Add the route
server.route({
    method: 'GET',
    path:'/hello',
    handler: function (request, reply) {
       reply('hello world');
    }
});

// Apps Static File Routes
server.route({
    method: 'GET',
    path: '/{subfolder}/{filename}',
    handler: function (request, reply) {
        reply.file(__dirname + "/" + encodeURIComponent(request.params.subfolder) + "/" + encodeURIComponent(request.params.filename));
    }
});

server.route({
    method: 'GET',
    path: '/{subfolder}/{subfolder2}/{filename}',
    handler: function (request, reply) {
        reply.file(__dirname + "/" + encodeURIComponent(request.params.subfolder) + "/" + encodeURIComponent(request.params.subfolder2) + "/" + encodeURIComponent(request.params.filename));
    }
});

server.route({
    method: 'GET',
    path: '/{subfolder}/{subfolder2}/{subfolder3}/{filename}',
    handler: function (request, reply) {
        reply.file(__dirname + "/" + encodeURIComponent(request.params.subfolder) + "/" + encodeURIComponent(request.params.subfolder2) + "/" + encodeURIComponent(request.params.subfolder3) + "/" + encodeURIComponent(request.params.filename));
    }
});


// Start the server
server.start(function () {
    console.log('Server running at:', server.info.uri);
});
