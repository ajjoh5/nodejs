//The 'Get all Active and Published Packages' Runway API
//https://henley.runway.com.au/api/2/packages?ModifiedSince=01/01/2015


//The Search Runway API
//https://henley.runway.com.au/api/2/search/packages?query=RangeName%3DMainVue+VIC


//The Package ID specific Runway API
//https://henley.runway.com.au/api/2/packages/091V403X4R3G3J1G9E288V0W210O?View=Extended

var Q = require('q');
var fs = require('fs');
var path = require('path');
var request = require('request');

module.exports.version = 1.0;
module.change_code = 1;

module.exports.Execute = function(jobID)
{
    var q = Q.defer();

    console.log('Get Runway - Active & Published Packages');

    //var url = 'https://henley.runway.com.au/api/2/packages?ModifiedSince=01/01/2015';
    //var url = 'http://webapi.henley.com.au/jobapi/Jobs/303091?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461';

    var options = {
        url: 'https://henley.runway.com.au/api/2/packages?ModifiedSince=01/01/2015',
        headers: {
            'Authorization': 'Bearer ef6b561f113e370bbbf4229f971161c07e7d58426e6262d6cd6328f88c27b3cbef958708dd877c8d7d0bec3ecebed015e5603b3da3c2996516c446e3b4ec2ccc'
        }
    };

    console.log(options);
    console.log('Sending Request: ' + url);

    request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body.length); // Show the HTML for the Google homepage.
        }
        else
        {
            console.log(error);
            console.log(body); // Show the HTML for the Google homepage.
        }

        q.resolve();
    });

    //requestify.get(url)
    //.then(function(response) {
    //    try
    //    {
    //        console.log('returned response..');
    //
    //        // Get the response body
    //        //var runwayFile_1 = __dirname + '/config/packages1.json';
    //        var runwayFile_1 = '/Users/ajjoh5/nodejs/nodejobs/config/packages1.json';
    //        console.log('Runway file #1: ' + runwayFile_1);
    //
    //        // Parse the body response json
    //        //var body = JSON.parse(response.getBody());
    //        var body = JSON.stringify(response.getBody());
    //
    //        fs.writeFile(runwayFile_1, body, function (err) {
    //            if (err) {
    //                console.log(err);
    //            }
    //            else
    //            {
    //                console.log('Write file succeeded: ' + runwayFile_1);
    //            }
    //        });
    //    }
    //    catch(err)
    //    {
    //        console.log('ERROR in CacheRunwayFeed.js - JobID: ' + jobID + ' Error was: ' + err);
    //    }
    //
    //    q.resolve();
    //});

    return q.promise;
};