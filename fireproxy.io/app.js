var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var art = require('ascii-art');
var url = require('url');
var request = require('request');
var dateFormat = require('dateformat');
var _ = require('underscore');
var fs = require('fs');

//Create global var __base for root path
global.__base = path.dirname(require.main.filename) + '/';

//Create particle DB reference
var particleDB = require('./lib/particle-io').create({ authtoken : 'ff1bc4174529248c949e04d601fecc2f7c7dde5a32367ebff5f559b0fcf2615a'});

//init variables
var appSettings = {
    port: 8887
};

//Setup environment variable
process.env.NODE_ENV = 'development';

//Create & Configure express app
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

function hotswapControllers() {
    var stack = [];

    _.each(app._router.stack, function(item) {
        stack.push(item);
    });

    //Clear the express routes stack + add routes dynamically
    _.each(stack, function(item) {

        if(item && item.route && item.route.path && item.route.path != '/updateControllers') {
            app._router.stack.splice(-1, 1);
        }
    });

    //console.log(stack);
    //console.log('1 - Routes loaded: ' + app._router.stack.length);

    //clear the controllers cache, and reload all controllers
    _.each(getFiles('./controllers'), function(controllerFile) {
        console.log(controllerFile);
        delete require.cache[require.resolve(controllerFile)];
        require(controllerFile)(app);
    });

    console.log('Routes loaded: ' + app._router.stack.length);
}

//TODO: Load controllers all sitting in "controllers" directory, when this API method is called
app.get('/updateControllers', function(req, res) {

    hotswapControllers();
    res.send('Controllers cache updated.');
});

console.log('Booting Controllers...');
hotswapControllers();

// app.all('/?*', function(req, res) {
//     var start = new Date();
//
//     var urlParts = url.parse(req.url, true);
//     var urlPath = urlParts.path;
//     var proxyUrl = 'http://localhost:5050' + urlPath;
//     var reqMethod = req.method.toLowerCase();
//
//     var options = {
//         url: proxyUrl,
//         method: req.method,
//         headers: {
//             'X-Forwarded-By': 'fireproxy.io'
//         }
//     };
//
//     if(reqMethod === 'post') {
//         var contentType = req.headers['content-type'];
//         if(contentType) {
//             if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
//                 options.form = req.body;
//             }
//             else {
//                 //assume json eg. if (contentType.indexOf('application/json') > -1)
//                 options.json = true;
//                 options.body = req.body;
//             }
//         }
//     }
//
//     //TODO: Create an API method that can be called to autoload all new controller within the "controllers" directory
//     //Handle any custom routes
//     // db['custom-routes'].loadDatabase(function (err) {
//     //     db['custom-routes'].findOne({ url : urlParts.pathname}, function (err, doc) {
//     //         try {
//     //             if(!err && doc) {
//     //                 //console.log('Custom Route: ' + urlParts.pathname);
//     //                 var customControllerFile = __base + '/controllers/' + doc.file;
//     //                 delete require.cache[require.resolve(customControllerFile)];
//     //                 var c = require(customControllerFile).create({});
//     //                 c.execute(req, db);
//     //             }
//     //             else {
//     //                 //console.log('Generic Route: ' + urlParts.pathname);
//     //             }
//     //         }
//     //         catch(ex) {
//     //             console.log(ex);
//     //         }
//     //     });
//     // });
//
//     //Send out request (GET, POST, PUT, DEL, etc)
//     request(options, function(error, response, body) {
//
//         res.set(response.headers);
//         res.send(body);
//
//         //Intercept the response + log the results
//         var responseTime = new Date() - start;
//         var message = '';
//
//         if (response.headers['content-type'] && response.headers['content-type'].indexOf('application/json') > -1) {
//             message = (!body.ResponseMessage) ? '' : body.ResponseMessage;
//         }
//
//         var logEntry = {
//             __type: 'info',
//             __group: 'fireproxy-io.' + reqMethod,
//             __id: new Date().getTime(),
//             handler : 'zzGeneric',
//             httpMethod : reqMethod.toUpperCase(),
//             httpStatusCode : response.statusCode,
//             path : urlPath,
//             exTime : responseTime,
//             message : message
//         };
//
//         //Send log entry to particle.io
//         particleDB.new(logEntry, function(err, data) {
//             if(err) {
//                 logEntry.created = dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT');
//                 db['fail-logs'].insert(logEntry);
//             }
//         });
//     });
// });

//Create server on configured port
app.listen(appSettings.port, function() {
    art.font('fireproxy.io', 'Doom', function(rendered){
        console.log(rendered);
        console.log('Port: '+ appSettings.port);
        console.log('Environment: ' + process.env.NODE_ENV);
    });
});