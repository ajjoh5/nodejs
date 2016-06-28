var leadsController = function(app) {

    console.log('> leadsController.js');
    var url = require('url');

	function CreateLead(req, pathPrefix) {
	
		var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;
		
		var basePath = (!pathPrefix) ? 'http://api2.henley.com.au' : pathPrefix
		
		var proxyUrl = basePath + urlPath;
		req.proxyUrl = proxyUrl;

        //Log create new siting to fireproxy.io first!
        var logEntry = {
            __type: 'info',
            __group: 'leads.new',
            handler : 'leadsController.js',
            httpMethod : 'post',
            httpStatusCode : 200,
            path : urlPath,
			proxy : {
				redirect: 'yes',
				url : proxyUrl
			}, 
			lead : req.body
        };

        req.logEntry = logEntry;
	}
	
	//Handle old leads post methods and proxy them to the leadsapi
    app.post('/Leads/CreateNewLead', function(req, res, next) {
        CreateLead(req, 'http://api2.henley.com.au/leadsapi');
        next();
    });
	
	app.post('/Leads/Create', function(req, res, next) {
		req.url = req.url.replace('/Leads/Create', '/Leads/CreateNewLead');
        CreateLead(req, 'http://api2.henley.com.au/leadsapi');
        next();
    });
	
	//proxy all other base path "/Leads" get requests -> proxy to "/leadsapi/Leads"
	app.get('/Leads/?*', function(req, res, next) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;
		
		var proxyUrl = 'http://api2.henley.com.au/leadsapi' + urlPath;
		req.proxyUrl = proxyUrl;
		
		//Log create new siting to fireproxy.io first!
        var logEntry = {
            __type: 'info',
            __group: 'leads.get',
            handler : 'leadsController.js',
            httpMethod : 'get',
            httpStatusCode : 200,
            path : urlPath,
			proxy : {
				redirect: 'yes',
				url : proxyUrl
			}
        };

        req.logEntry = logEntry;
		
        next();
    });
	
	app.post('/jobapi/Leads/CreateNewLead', function(req, res, next) {	
		CreateLead(req, 'http://api2.henley.com.au');
        next();
    });
	
	app.post('/jobapi/Leads/Create', function(req, res, next) {
        req.url = req.url.replace('/jobapi/Leads/Create', '/Leads/CreateNewLead');
        CreateLead(req, 'http://api2.henley.com.au/leadsapi');
        next();
    });
	
	
	//proxy all other base path "/jobapi/Leads" get requests -> proxy to "api2.henley.com.au/jobapi/Leads"
	app.get('/jobapi/Leads/?*', function(req, res, next) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;
		
		var proxyUrl = 'http://api2.henley.com.au' + urlPath;
		req.proxyUrl = proxyUrl;
		
		//Log create new siting to fireproxy.io first!
        var logEntry = {
            __type: 'info',
            __group: 'jobapi-leads.get',
            handler : 'leadsController.js',
            httpMethod : 'get',
            httpStatusCode : 200,
            path : urlPath,
			proxy : {
				redirect: 'yes',
				url : proxyUrl
			}
        };

        req.logEntry = logEntry;
		
        next();
    });
	
	
	app.post('/leadsapi/Leads/CreateNewFormLead', function(req, res, next) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;
		
		var proxyUrl = 'http://api2.henley.com.au' + urlPath;
		req.proxyUrl = proxyUrl;

        //Log create new siting to fireproxy.io first!
        var logEntry = {
            __type: 'info',
            __group: 'leads.new',
            handler : 'leadsController.js',
            httpMethod : 'post',
            httpStatusCode : 200,
            path : urlPath,
			proxy : {
				redirect: 'yes',
				url : proxyUrl
			}, 
			lead : req.body
        };

        req.logEntry = logEntry;

        next();
    });
	
	// function GetLeadDropDownValues(req, pathPrefix) {
	
		// var urlParts = url.parse(req.url, true);
        // var urlPath = urlParts.path;
		
		// var basePath = (!pathPrefix) ? 'http://api2.henley.com.au' : pathPrefix
		
		// var proxyUrl = basePath + urlPath;
		// req.proxyUrl = proxyUrl;

        // //Log create new siting to fireproxy.io first!
        // var logEntry = {
            // __type: 'info',
            // __group: 'leads.get-lead-DDLs',
            // handler : 'leadsController.js',
            // httpMethod : 'post',
            // httpStatusCode : 200,
            // path : urlPath,
			// proxy : {
				// redirect: 'yes',
				// url : proxyUrl
			// }
        // };

        // req.logEntry = logEntry;
	// }	
	
	// app.get('/jobapi/Leads/GetRegionsByCompany', function(req, res, next) {
        // GetLeadDropDownValues(req, 'http://api2.henley.com.au');
        // next();
    // });
	
	// app.get('/jobapi/Leads/GetRegions', function(req, res, next) {
        // GetLeadDropDownValues(req, 'http://api2.henley.com.au');
        // next();
    // });
	
	// app.get('/jobapi/Leads/GetWhereHeardAbout', function(req, res, next) {
        // GetLeadDropDownValues(req, 'http://api2.henley.com.au');
        // next();
    // });
	
	// app.get('/Leads/GetRegionSalesUnits', function(req, res, next) {
        // GetLeadDropDownValues(req, 'http://api2.henley.com.au/jobapi');
        // next();
    // });
	
	// app.get('/Leads/GetWhereHeardAbout', function(req, res, next) {
        // GetLeadDropDownValues(req, 'http://api2.henley.com.au/jobapi');
        // next();
    // });
	
	// app.get('/Leads/GetRegions', function(req, res, next) {
        // GetLeadDropDownValues(req, 'http://api2.henley.com.au/jobapi');
        // next();
    // });
	
	// app.get('/Leads/GetAllSalesUnits', function(req, res, next) {
        // GetLeadDropDownValues(req, 'http://api2.henley.com.au/jobapi');
        // next();
    // });
	
};

module.exports = leadsController;