//Express Plugins
var express = require('express');
var compress = require('compression');

//Other plugins
var requestify = require('requestify');
var request = require('request');
var bodyParser = require('body-parser');
var _ = require('underscore');
var proxy = require('express-http-proxy');
var proxy2  = require('proxy-express');
var async = require('async');

//Libraries
var runwaydata = require('./lib/runway-data');


//Create & Configure express app
var app = express();
app.use(compress());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/runway/get-packages', function(req, res) {

    console.time('total-time');
    console.time("get-packages");

    //Login to runway
    runwaydata.loginToRunway(function(data) {

        //Set the session id to new session id returned
        var jsid = data;

        var publishedPackages = [];
        var rangePackages = [];
        var rangeName = 'MainVue VIC';

        //Run runway calls in parallel and once finished, then compile all packages into json file
        async.parallel([
            function(callback) {

                runwaydata.GetPublishedRunwayPackages(jsid, function (err, data) {
                    callback(err, data);
                })
            },
            function(callback) {
                runwaydata.GetRangePackages(jsid, rangeName, function(err, data) {
                    callback(err, data);
                })
            }
        ],
        function(err, results){
            //Join published packages with range specific packages
            //(because the combo of both data's = the core data we need)

            console.timeEnd("get-packages");
            console.time("join-packages");

            var pub = results[0];


            runwaydata.JoinPublishedAndRangePackages(results[0], results[1], rangeName, function(err, data) {

                console.timeEnd("join-packages");
                console.time("add-extendedinfo-packages");

                var promises = [];

                //Run through each package and generate json file
                _.each(data, function(item) {

                    promises.push(function(callback) {

                        //Add the package items 'City' and 'HomeSize' from the individual runway package calls
                        runwaydata.GetPackageByIDExtendedView(jsid, item.PackageID, function(err, data) {
                            var e_package = data;

                            var homeSize = _.find(e_package.Plan.Details, function(eItem) {
                                return eItem.DetailsType === 'House';
                            });

                            item.City = e_package.Address.City ? e_package.Address.City : '---';
                            item.HomeSize = homeSize.Squares ? homeSize.Squares : '---';

                            callback(null, 'Completed');
                        });

                    });

                });

                async.parallel(promises, function(err, results) {
                    // Once all package items are updated with 'City' and 'HomeSize' then show the final result
                    console.timeEnd("add-extendedinfo-packages");
                    console.timeEnd('total-time');
                    res.send(data);
                });

            });


            //Compile all packages into 1 json file

            //Wait for the first to runway calls to come back before running each individual package call

            //runwaydata.GetPackageByIDExtendedView(jsid, '091V403X4R3G3J1G9E288V0W210O', function(err, data) {
            //    e_package = data;
            //    res.send(data);
            //});
        });

        //res.send('Finished');
    });

});

app.use(proxy2('localhost:3001', '/foo'));

app.use(proxy2('localhost:3001', {
    prefix : '/food'
    // /foo/test => /test
    // /test => ignored by proxy
}));

app.use('/api/2', proxy('webapi.henley.com.au/jobapi', {
    forwardPath: function(req, res) {
        return require('url').parse(req.url).path;
    }
}));

app.use('/api/3', proxy('http://localhost:3001/', {
    filter: function(req, res) {
        return req.method == 'GET';
    },
    forwardPath: function(req, res) {
        return require('url').parse(req.url).path;
    }
}));

app.get('/proxyapp/3/web', function(req, res) {

    var apiUrl = 'http://webapi.henley.com.au/jobapi/Jobs/301605?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461';

    var options = {
        url: apiUrl
    };

    request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('success...');
            //console.log(response.statusCode);
            res.send(body);
            //console.log(body);
        }
        else
        {
            console.log('error...');
            //console.log(error);
            //console.log(response.statusCode);
            console.log(body);
            res.send(body);
        }
    });

});

app.get('/proxyapp/4/web', function(req, res) {

    var apiUrl = 'http://webapi.henley.com.au/jobapi';
    //var apiUrl = 'http://localhost:3001';

    var options = {
        url: apiUrl
    };

    request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('success...');
            //console.log(response.statusCode);
            res.send(body);
            //console.log(body);
        }
        else
        {
            console.log('error...');
            //console.log(error);
            //console.log(response.statusCode);
            console.log(body);
            res.send(body);
        }
    });

});

app.get('/proxyapp/5/web', function(req, res) {

    //modify the url in any way you want
    var apiUrl = 'http://webapi.henley.com.au/jobapi/Jobs/301605?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461';
    //var newurl = 'http://localhost:3001';
    request(apiUrl).pipe(res);

});

app.get('/runway/c', function(req, res) {

    console.log('Runway COOKIE Auth...');

    var jar = request.jar();
    //var cookie = request.cookie('JSESSIONID');
    //var cookie = request.cookie('JSESSIONID=4B2565E0999F804B5253DCED3BF4454C');

    var data = {
        Username : 'ajohnstone',
        Password : 'welcome'
    };

    //jar.add(cookie);

    request({
        uri: 'http://henley.runway.com.au/actions/loginaction.jsp',
        method: 'POST',
        form: data,
        jar: jar
    }, function(error, response, body) {
        //console.log(body);

        var cjson = JSON.stringify(jar._jar);
        var cList = JSON.parse(cjson);
        var runwayCookie = _.find(cList.cookies, function(item){ return item.key === 'JSESSIONID'; });

        //console.log(runwayCookie);
        jsid = runwayCookie.value;
        res.send('Completed: ' + jsid);
    });

});

app.get('/runway/c/runapi', function(req, res) {

    var jar = request.jar();
    var cookie = request.cookie('JSESSIONID=' + jsid);

    var apiUrl = 'https://henley.runway.com.au/api/2/packages?ModifiedSince=10/08/2015';
    jar.setCookie(cookie, apiUrl);

    var options = {
        url: apiUrl,
        jar: jar
    };

    //console.log(options);
    console.log('Sending Request: ' + options.url);

    request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('success...');
            //console.log(response.statusCode);
            res.send(body);
            //console.log(body);
        }
        else
        {
            console.log('error...');
            //console.log(error);
            //console.log(response.statusCode);
            console.log(body);
            res.send(body);
        }
    });

});


app.get('/runway/oauth', function(req, res) {

    console.log('Sending Runway OAUTH...');

    //Your sending email address post data
    //var sender = req.body.name + ' <' + req.body.email + '>';
    //var mailedFrom = 'contact@adamjohnstone.co';
    //var recipients = 'ajjoh5@gmail.com';
    //var message = 'Contact Details: \n' + sender + '\n\nMessage:' + req.body.message;

    //var options = {
    //    auth: {
    //        username: 'api',
    //        password: 'key-74bcec52b1dd582c2989aec6022ce95d'
    //    },
    //    dataType: 'form-url-encoded'
    //};

    var options = {
        dataType: 'form-url-encoded'
    };


    //var data = {
    //    from : mailedFrom,
    //    to : recipients,
    //    subject : 'AdamJohnstone.co - Contact Request Submitted',
    //    text : message
    //};

    //Authorization: Basic aGVubGV5aXQ6I2hlbjMzejIxIQ==

    var data = {};

    //var url = 'https://henley.runway.com.au/oauth/?client_id=0L1G4C3G7N042K91482Z4D9K3G8G&redirect_uri=http://localhost:3002/oauthcallback&response_type=code&access_type=offline&state=Y76123af';
    var url = 'https://henley.runway.com.au/api/2/oauth/token?client_id=0L1G4C3G7N042K91482Z4D9K3G8G&';

    requestify.post(url, data, options)
    .then(function(response) {
        // Get the response body
        var body = response.getBody();
        console.log(body);

        res.send(body);
    });

    //requestify.get(url)
    //.then(function(response) {
    //    console.log('ff');
    //    // Get the response body
    //    var body = response.getBody();
    //    console.log(body);
    //    res.send('Finished');
    //});

    console.log('Finished');
    //res.send('Finished');
});

app.get('/runway/oauthcallback', function(req, res) {

    console.log('!! Received Runway OAUTH...');

});

app.listen(3002, function() {
    console.log('Server running at: 3002');
});