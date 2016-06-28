//init requries
var assert = require('assert');
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
	
//init variables
// global.__base = path.dirname(__dirname);
// var logFileDir = __base + '/lib/logs/';

describe('API Tests', function() {

    before(function() {
        // --[ TEARDOWN SCRIPTS ]--
        
    });

    it('Test Logging to Particle + Log Files (Get Job "303090")', function(done) {
		
		var options = {
            url: 'http://proxy2/jobapi/Jobs/303090?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461',
            method: 'GET',
			followAllRedirects: true
        };
		
		request(options, function(err, response, body) {
			//if (!err && response.statusCode == 200) {
				var data = JSON.parse(body);
				assert.equal(data.JobList[0].JobNumber, '303090');
				done();
			//}
		});
		
    });

	var manualLead = { 
			"BrandInterestedIn": "Henley", 
			"CollectionBoth": "No", 
			"CollectionHenley": "No", 
			"CollectionMainVue": "Yes", 
			"Email": "email@email.com", 
			"FirstName": "TEST - Lead", 
			"FreeSiteAssessment": "No", 
			"InputSource": "VICTORIA - thesmartmove.com.au/vic", 
			"InterestBoth": "", 
			"InterestDouble": "", 
			"InterestSingle": "SNG", 
			"LandFrontage": "17", 
			"LandSize": "123", 
			"LandSuburb": "Melbourne", 
			"LastName": "Lead", 
			"Mobile": "0491827162", 
			"MoreInfo": "No", 
			"OwnLand": "Yes", 
			"RedirectPage": "", 
			"StepByStepGuide": "No", 
			"Subject": "The Smart Move - Victoria - Register your Interest", 
			"SubscribeToNews": "No", 
			"prefContact": "" 
		};
	
    xit('POST Manual Lead (form lead) - SmartMove Lead (HEN)', function(done) {
		
		this.timeout(5000);
		
		var options = {
            url: 'http://proxy2/leadsapi/Leads/CreateNewFormLead?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461',
            method: 'POST',
			form: manualLead,
			followAllRedirects: true
        };
		
		request(options, function(err, response, body) {
			if (!err && response.statusCode == 200) {				
				assert.equal(body.indexOf('window.location.href') != -1, true);
				done();
			}
		});
		
    });
	
	var autoLead = { 
			"Comments": "This is a test lead - please ignore", 
			"Email": "email@email.com", 
			"FirstName": "TEST - Lead", 
			"FreeSiteAssessment": false, 
			"InputSource": "2", 
			"LandStatus": false, 
			"LastName": "Lead - Ignore", 
			"LeadBrand": "5637144578", 
			"LeadRegion": "5637145584", 
			"LeadSalesUnit": "5637150830", 
			"MobilePhone": "0491827162", 
			"MoreInfoHomeDesign": false, 
			"PreferredContact": "1", 
			"StepByStepGuide": false, 
			"StreetAddress": "n/a", 
			"Subject": "5637145076", 
			"Subscribe": false, 
			"SyncStatus": 0, 
			"WhereDidYouHear": "5637145336", 
			"ZipCode": "n/a" 
		};
	
	xit('POST Auto Dynamics Lead - /Leads/CreateNewLead', function(done) {
		
		this.timeout(5000);	
		var options = {
            url: 'http://proxy2/Leads/CreateNewLead?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461',
            method: 'POST',
			json: true,
			body: autoLead,
			followAllRedirects: true
        };
		
		request(options, function(err, response, body) {
			if (!err && response.statusCode == 200) {
				assert.equal(body.Result.Email, 'email@email.com');
				done();
			}
		});
		
	});
	
	xit('POST Auto Dynamics Lead - /Leads/Create', function(done) {
		
		this.timeout(5000);	
		var options = {
            url: 'http://proxy2/Leads/Create?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461',
            method: 'POST',
			json: true,
			body: autoLead,
			followAllRedirects: true
        };
		
		request(options, function(err, response, body) {
			if (!err && response.statusCode == 200) {
				assert.equal(body.Result.Email, 'email@email.com');
				done();
			}
		});
		
	});
	
	xit('POST Auto Dynamics Lead - /jobapi/Leads/CreateNewLead', function(done) {
		
		this.timeout(5000);	
		var options = {
            url: 'http://proxy2/jobapi/Leads/CreateNewLead?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461',
            method: 'POST',
			json: true,
			body: autoLead,
			followAllRedirects: true
        };
		
		request(options, function(err, response, body) {
			if (!err && response.statusCode == 200) {
				assert.equal(body.Result.Email, 'email@email.com');
				done();
			}
		});
		
	});
	
	xit('POST Auto Dynamics Lead - /jobapi/Leads/Create', function(done) {
		
		this.timeout(5000);	
		var options = {
            url: 'http://proxy2/jobapi/Leads/Create?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461',
            method: 'POST',
			json: true,
			body: autoLead,
			followAllRedirects: true
        };
		
		request(options, function(err, response, body) {
			if (!err && response.statusCode == 200) {
				assert.equal(body.Result.Email, 'email@email.com');
				done();
			}
		});
		
	});
	
	it('GET Requests - /Leads/GetAllSalesUnits', function(done) {
			
		request.get('http://proxy2/Leads/GetAllSalesUnits?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461', function(err, response, body) {
			var data = JSON.parse(body);
			assert.equal(data.length, 79);
			done();
		});
		
	});
	
	it('GET Requests - /Leads/GetRegions', function(done) {
				
		request.get('http://proxy2/Leads/GetRegions?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461&brandID=Henley', function(err, response, body) {
			var data = JSON.parse(body);
			assert.equal(data.length, 9);
			done();
		});
		
	});
	
	it('GET Requests - /Leads/GetRegionSalesUnits', function(done) {
			
		request.get('http://proxy2/Leads/GetRegionSalesUnits?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461&regionID=5637145578&brandID=Henley', function(err, response, body) {
			var data = JSON.parse(body);
			assert.equal(data.length, 7);
			done();
		});
		
	});
	
	it('GET Requests - /Leads/GetWhereHeardAbout', function(done) {
			
		request.get('http://proxy2/Leads/GetWhereHeardAbout?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461&dataareaid=vhe', function(err, response, body) {
			var data = JSON.parse(body);
			assert.equal(data.length, 14);
			done();
		});
		
	});
	
	it('GET Requests - /jobapi/Leads/GetAllSalesUnits', function(done) {
			
		request.get('http://proxy2/jobapi/Leads/GetAllSalesUnits?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461', function(err, response, body) {
			var data = JSON.parse(body);
			assert.equal(data.length, 79);
			done();
		});
		
	});
	
	it('GET Requests - /jobapi/Leads/GetRegions', function(done) {
				
		request.get('http://proxy2/jobapi/Leads/GetRegions?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461&brandID=Henley', function(err, response, body) {
			var data = JSON.parse(body);
			assert.equal(data.length, 9);
			done();
		});
		
	});
	
	it('GET Requests - /jobapi/Leads/GetRegionSalesUnits', function(done) {
			
		request.get('http://proxy2/jobapi/Leads/GetRegionSalesUnits?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461&regionID=5637145578&brandID=Henley', function(err, response, body) {
			var data = JSON.parse(body);
			assert.equal(data.length, 7);
			done();
		});
		
	});
	
	it('GET Requests - /jobapi/Leads/GetWhereHeardAbout', function(done) {
			
		request.get('http://proxy2/jobapi/Leads/GetWhereHeardAbout?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461&dataareaid=vhe', function(err, response, body) {
			var data = JSON.parse(body);
			assert.equal(data.length, 14);
			done();
		});
		
	});

});