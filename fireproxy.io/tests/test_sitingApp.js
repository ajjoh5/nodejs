//init requries
//var assert = require('assert');
var assert = require('chai').assert;
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');


describe('API Tests', function() {

    before(function() {
        // --[ TEARDOWN SCRIPTS ]--
        
    });

	it('GET - Siting Projects By ...', function(done) {
			
		this.timeout(20000);
			
		request.get('http://proxy2/jobapi/SitingAPP/SitingProjectsBy/vhe/Henley/Clendonvale?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461', function(err, response, body) {
			var data = JSON.parse(body);
			
			//expect(data.SitingProjects).to.be.a('array');
			assert.isArray(data.SitingProjects, 'Siting Projects object is an array');
			assert.isAbove(data.SitingProjects.length, 5, 'Siting Projects array length above 5');
			
			done();
		});
	});
	
	it('GET - Design Register Data (Henley > Cosmopolitan)', function(done) {
			
		this.timeout(20000);
			
		request.get('http://proxy2/jobapi/Company/vhe/Henley/Cosmopolitan?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461', function(err, response, body) {
			var data = JSON.parse(body);
			
			//expect(data.SitingProjects).to.be.a('array');
			assert.isArray(data.houseClasses, 'House Classes object is an array');
			assert.isAbove(data.houseClasses.length, 10, 'House Classes array length above 17');
			
			done();
		});
	});
	
	it('GET - Design Register Data (Henley > Clendonvale)', function(done) {
			
		this.timeout(20000);
			
		request.get('http://proxy2/jobapi/Company/vhe/Henley/Clendonvale?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461', function(err, response, body) {
			var data = JSON.parse(body);
			
			assert.isArray(data.houseClasses, 'House Classes object is an array');
			assert.isAbove(data.houseClasses.length, 10, 'House Classes array length above 17');
			
			done();
		});
	});
	
	it('GET - Design Register Data (Mainvue > MainVue)', function(done) {
			
		this.timeout(20000);
			
		request.get('http://proxy2/jobapi/Company/vhe/Mainvue/MainVue?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461', function(err, response, body) {
			var data = JSON.parse(body);
			
			assert.isArray(data.houseClasses, 'House Classes object is an array');
			assert.isAbove(data.houseClasses.length, 5, 'House Classes array length above 17');
			
			done();
		});
	});
	
	it('GET - Design Register Data (Plantation > Plantation)', function(done) {
			
		this.timeout(20000);
			
		request.get('http://proxy2/jobapi/Company/qhe/Plantation/Plantation?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461', function(err, response, body) {
			var data = JSON.parse(body);
			
			assert.isArray(data.houseClasses, 'House Classes object is an array');
			assert.isAbove(data.houseClasses.length, 10, 'House Classes array length above 17');
			
			done();
		});
	});
	
	it('GET - Opportunity Search', function(done) {
		
		this.timeout(10000);
			
		request.get('http://proxy2/jobapi/Opportunity/Search?keytoken=766f7274696c612068656e6c65792064657369676e7265676973746572&name=John&address=', function(err, response, body) {
			var data = JSON.parse(body);
			
			assert.isArray(data.houseClasses, 'House Classes object is an array');
			assert.isAbove(data.houseClasses.length, 10, 'House Classes array length above 17');
			
			done();
		});
	});
	
	it('GET - Siting App Folders & Files', function(done) {
		//jobapi/SitingApp/ReferenceData/?*
		
		this.timeout(10000);
			
		request.get('http://proxy2/jobapi/SitingAPP/ReferenceData/GetFile?keytoken=5265616479204275696c74205765622053697465205073777264202431&folder=RB_NEW_FLOORPLANS&file=Thumbs.db', function(err, response, body) {

			assert.equal(response.statusCode, 200, 'File not returned from reference data');			
			done();
		});
	});	

});