var Hapi = require('hapi');
var Path = require('path');
var _ = require('underscore');
var fs = require('fs');


//Register Handlebars, Handlebars Layouts
var handlebars = require('handlebars');
var layouts = require('handlebars-layouts');
layouts.register(handlebars);

var config = {
    routes : [
        {
            url : 'henleyjobs',
            apiUrl : 'http://webapi.henley.com.au/jobapi/Jobs?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461&Brand=Henley&CurrentPhaseID=Admin',
            filters : ''
        },
        {
            url : 'henleyjobs/search/{jobnumber}',
            apiUrl : 'http://webapi.henley.com.au/jobapi/Jobs?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461&Brand=Henley&CurrentPhaseID=Admin',
            filters : {
                paramName : 'jobnumber',
                arrayToFilter : 'JobList',
                fieldToFilter : 'JobNumber'
            }
        }
    ]
};

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
    handler: function (request, reply) {
        var appName = 'home';

        if (request.params.route) {
            var routeList = request.params.route.split('/');
            appName = routeList[0];
        }

        console.log('Serving AppName: ' + appName);


        reply.view(appName, {
            title: 'NodeFire.io', appTitle : 'NodeFire.io | Home'
        });
    }
});

server.route({
    method: 'GET',
    path: '/api/' + config.routes[1].url,
    handler: function (request, reply)
    {
        var routeList = [];
        var appName = 'api';
        var apiName = '';
        var routeConfig = config.routes[1];

        console.log('Serving Route: ' + routeConfig.apiUrl);
        if(request.url.query)
        {
            var obj = request.url.query;
            for(var key in obj)
            {
                var attrName = key;
                var attrValue = obj[key];
                console.log('QueryString - "' + attrName + '" = "' + attrValue + '"');
            }
        }

        return http.get(routeConfig.apiUrl, function(response) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function(chunk)
            {
                body += chunk;
            });
            response.on('end', function()
            {
                //Can change the callback in here if required??
                var json = JSON.parse(body);

                // filters : [{
                //     paramName : 'jobnumber',
                //     arrayToFilter : 'JobList',
                //     fieldToFilter : 'jobnumber'
                // }]

                var arrayToFilter = routeConfig.filters.arrayToFilter;
                console.log('Array to Filter: ' + arrayToFilter);

                var fieldToFilter = routeConfig.filters.fieldToFilter;
                console.log('Field to Filter: ' + fieldToFilter);

                var paramToFilter = request.params[routeConfig.filters.paramName];
                console.log('Param Value to Filter On: ' + paramToFilter);

                //console.log(json[arrayToFilter]);


                //var test = _.where(json[arrayToFilter], { eval(fieldToFilter) : '306969'});
                var test = _.filter(json[arrayToFilter], function(item) {
                    if(item[fieldToFilter] == paramToFilter)
                    {
                        return item;
                    }
                });
                console.log(test);

                reply(test);
            });
        });


        //http://webapi.henley.com.au/jobapi/Jobs/301605?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461
        // return reply.proxy({
        //     host: 'webapi.henley.com.au',
        //     uri : '/jobapi/Jobs/301605?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461',
        //     port: 80,
        //     protocol: 'http'
        // });
    }
});

server.route({
    method: 'GET',
    path: '/api/runway/packages/{brand}',
    handler: function (request, reply)
    {
        var routeList = [];
        var appName = 'api';
        var apiName = '';

        console.log('Runway...');
        var json = {};

        fs.readFile('nodefire/jsonfiles/packages3.json', 'utf8', function (err,data)
        {
            if (err) {
                return console.log(err);
            }

            json = JSON.parse(data);

            var test = [];
            _.each(json, function(item)
            {
                if(item.Plan.Home.Range.Name == 'MainVue VIC'
                && item.Publishing.Status == 'Published')
                {
                    //console.log(item);
                    item.EstateName = item.Lot.Stage.Estate.Name;
                    test.push(item);
                }
            })

            test = _.sortBy(test, 'EstateName');

            _.each(test, function(item) {
                console.log(item.EstateName + ' - ' + item.Name);
            })

            reply(test);

        });
    }
});

server.route({
    method: 'GET',
    path: '/api/{route*}',
    handler: function (request, reply)
    {
        var routeList = [];
        var appName = 'api';
        var apiName = '';
        var routeConfig = [];

        //Get the API we are being asked to call
        if(request.params.route)
        {
            routeList = request.params.route.split('/');
            apiName = routeList[0];
            if(apiName)
            {
                routeConfig = _.findWhere(config.routes, { url : apiName })
            }
        }

        console.log('Serving Route: ' + request.params.route);
        if(request.url.query)
        {
            var obj = request.url.query;
            for(var key in obj)
            {
                var attrName = key;
                var attrValue = obj[key];
                console.log('QueryString - "' + attrName + '" = "' + attrValue + '"');
            }
        }

        return http.get(routeConfig.apiUrl, function(response) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function(chunk)
            {
                body += chunk;
            });
            response.on('end', function()
            {
                //Can change the callback in here if required??
                var json = JSON.parse(body);

                //if(routeConfig.params)
                for (i = 1; i < routeList.length; i++) {
                    json = json[routeList[i]];
                }

                reply(json);
            });
        });


        //http://webapi.henley.com.au/jobapi/Jobs/301605?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461
        // return reply.proxy({
        //     host: 'webapi.henley.com.au',
        //     uri : '/jobapi/Jobs/301605?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461',
        //     port: 80,
        //     protocol: 'http'
        // });
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
    path: '/favicon.ico',
    handler: function (request, reply) {
        reply.file(__dirname + "/favicon.ico");
    }
});

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
