var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var art = require('ascii-art');
var url = require('url');
var request = require('request');
var dateFormat = require('dateformat');

//Create global var __base for root path
global.__base = path.dirname(require.main.filename) + '/';

//Create logging backup db on filesystem
var Datastore = require('nedb');
var db = {};
db['fail-logs'] = new Datastore({ filename: __base + '/logs/fail-logs.db', autoload: true});
db['custom-routes'] = new Datastore({ filename: __base + '/data/custom-routes.db', autoload: true});

//Create particle DB reference
var particleDB = require('./lib/particle-io').create({ authtoken : 'ff1bc4174529248c949e04d601fecc2f7c7dde5a32367ebff5f559b0fcf2615a'});

//init variables
var appSettings = {
    port: 8888
};

//Setup environment variable
process.env.NODE_ENV = 'development';

//Create & Configure express app
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// console.log('Booting Controllers...');
// require(__base + "/controllers/leadsController.js")(app);

app.all('/?*', function(req, res) {
    var start = new Date();

    var urlParts = url.parse(req.url, true);
    var urlPath = urlParts.path;
    var proxyUrl = 'http://localhost:5050' + urlPath;
    var reqMethod = req.method.toLowerCase();

    var options = {
        url: proxyUrl,
        method: req.method,
        headers: {
            'X-Forwarded-By': 'fireproxy.io'
        }
    };

    if(reqMethod === 'post') {
        var contentType = req.headers['content-type'];
        if(contentType) {
            if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
                options.form = req.body;
            }
            else {
                //assume json eg. if (contentType.indexOf('application/json') > -1)
                options.json = true;
                options.body = req.body;
            }
        }
    }

    //TODO: Go to DB and load custom routes that map to controller files / require them on the fly
    // Here we load in dynamically any override routes from our configuration
    db['custom-routes'].findOne({ url : urlPath}, function (err, doc) {
        if(!err && docs) {
            console.log('Custom Route...');
            console.log(docs);
            var customControllerFile = __base + '/controllers/' + doc.file;
            delete require.cache[require.resolve(customControllerFile)];
            var c = require(customControllerFile).create({});
            req = c.execute(req);
        }
    });

    //Send out request (GET, POST, PUT, DEL, etc)
    request(options, function(error, response, body) {

        res.set(response.headers);
        res.send(body);

        //Intercept the response + log the results
        var responseTime = new Date() - start;
        var message = '';

        if (response.headers['content-type'].indexOf('application/json') > -1) {
            message = (!body.ResponseMessage) ? '' : body.ResponseMessage;
        }

        var logEntry = req.logEntry;

        if(!logEntry) {
            logEntry = {
                type: 'info',
                group: 'fireproxy-io.' + reqMethod,
                handler : 'zzGeneric',
                httpMethod : reqMethod.toUpperCase(),
                httpStatusCode : response.statusCode,
                path : urlPath,
                exTime : responseTime,
                message : message
            };
        }

        //Send log entry to particle.io
        particleDB.new(logEntry, function(err, data) {
            if(err) {
                logEntry.created = dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT');
                db['fail-logs'].insert(logEntry);
            }
        });
    });
});

//Create server on configured port
app.listen(appSettings.port, function() {
    art.font('fireproxy.io', 'Doom', function(rendered){
        console.log(rendered);
        console.log('Port: '+ appSettings.port);
        console.log('Environment: ' + process.env.NODE_ENV);
    });
});