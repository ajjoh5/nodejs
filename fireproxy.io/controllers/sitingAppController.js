var sitingAppController = function(app) {

    console.log('> sitingAppController.js');
	//Leads/CreateNewLead

    var url = require('url');

	// app.get('/jobapi/SitingAPP/ReferenceData/GetFile', function(req, res, next) {

        // var urlParts = url.parse(req.url, true);
        // var urlPath = urlParts.path;

        // //Log create new siting to fireproxy.io first!
        // var logEntry = {
            // __type: 'info',
            // __group: 'sitingApp.get-file',
            // handler : 'sitingAppController.js',
            // httpMethod : 'get',
            // httpStatusCode : 200,
            // path : urlPath
        // };

        // req.logEntry = logEntry;

        // next();
    // });
	
	app.get('/jobapi/SitingAPP/SitingProjectsBy/?*', function(req, res, next) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;

		var proxyUrl = 'http://api2.henley.com.au' + urlPath;
		req.proxyUrl = proxyUrl;
		
        //Log create new siting to fireproxy.io first!
        var logEntry = {
            __type: 'info',
            __group: 'sitingApp.projectsBy',
            handler : 'sitingAppController.js',
            httpMethod : 'get',
            httpStatusCode : 200,
            path : urlPath
        };

        req.logEntry = logEntry;

        next();
    });
	
    app.post('/jobapi/SitingAPP/CreateNewSitingDetail', function(req, res, next) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;

		var proxyUrl = 'http://api2.henley.com.au' + urlPath;
		req.proxyUrl = proxyUrl;
		
        //Log create new siting to fireproxy.io first!
        var logEntry = {
            __type: 'info',
            __group: 'sitingApp.new',
            handler : 'sitingAppController.js',
            httpMethod : 'post',
            httpStatusCode : 200,
            path : urlPath
        };

        req.logEntry = logEntry;

        next();
    });
	
	app.post('/jobapi/SitingAPP/EditSitingDetail', function(req, res, next) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;

		var proxyUrl = 'http://api2.henley.com.au' + urlPath;
		req.proxyUrl = proxyUrl;
		
        //Log create new siting to fireproxy.io first!
        var logEntry = {
            __type: 'info',
            __group: 'sitingApp.edit',
            handler : 'sitingAppController.js',
            httpMethod : 'post',
            httpStatusCode : 200,
            path : urlPath
        };

        req.logEntry = logEntry;

        next();
    });
	
	app.get('/jobapi/Company/?*', function(req, res, next) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;

		var proxyUrl = 'http://api2.henley.com.au' + urlPath;
		req.proxyUrl = proxyUrl;

        next();
    });
	
	app.get('/jobapi/Opportunity/?*', function(req, res, next) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;

		var proxyUrl = 'http://api2.henley.com.au' + urlPath;
		req.proxyUrl = proxyUrl;

        next();
    });
	
	app.get('/jobapi/SitingApp/ReferenceData/?*', function(req, res, next) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;

		var proxyUrl = 'http://api2.henley.com.au' + urlPath;
		req.proxyUrl = proxyUrl;
		
		var logEntry = {
            __type: 'info',
            __group: 'sitingApp.reference-data',
            handler : 'sitingAppController.js',
            httpMethod : 'get',
            httpStatusCode : 200,
            path : urlPath
        };

        req.logEntry = logEntry;

        next();
    });
	
	app.get('/jobapi/Opportunity/Search', function(req, res, next) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;

		var proxyUrl = 'http://api2.henley.com.au' + urlPath;
		req.proxyUrl = proxyUrl;
		
		var logEntry = {
            __type: 'info',
            __group: 'sitingApp.opportunity-search',
            handler : 'sitingAppController.js',
            httpMethod : 'get',
            httpStatusCode : 200,
            path : urlPath
        };

        req.logEntry = logEntry;

        next();
    });
	
	app.get('/jobapi/Company/Login', function(req, res, next) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;

		var proxyUrl = 'http://api2.henley.com.au' + urlPath;
		req.proxyUrl = proxyUrl;
		
		var logEntry = {
            __type: 'info',
            __group: 'sitingApp.henley-login',
            handler : 'sitingAppController.js',
            httpMethod : 'get',
            httpStatusCode : 200,
            path : urlPath
        };

        req.logEntry = logEntry;

        next();
    });
	
};

module.exports = sitingAppController;