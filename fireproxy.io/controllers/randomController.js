var leadsController = function(app) {

    console.log('> randomController.js');
	//Leads/CreateNewLead

    var url = require('url');

    app.get('/OnbaseDocuments/GetDocumentCategories', function(req, res, next) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;
		
		var proxyUrl = 'http://api2.henley.com.au/jobapi' + urlPath;
		req.proxyUrl = proxyUrl;

        //Log create new siting to fireproxy.io first!
        var logEntry = {
            __type: 'info',
            __group: 'onbase.getDocCategories',
            handler : 'randomController.js',
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
	
	//proxy all other base path "/OnbaseDocuments" get requests -> proxy to "/jobapi/OnbaseDocuments"
	app.get('/OnbaseDocuments/?*', function(req, res, next) {

        var urlParts = url.parse(req.url, true);
        var urlPath = urlParts.path;
		
		var proxyUrl = 'http://api2.henley.com.au/jobapi' + urlPath;
		req.proxyUrl = proxyUrl;
		
		//Log create new siting to fireproxy.io first!
        var logEntry = {
            __type: 'info',
            __group: 'onbase-documents.get',
            handler : 'randomController.js',
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
	
};

module.exports = leadsController;