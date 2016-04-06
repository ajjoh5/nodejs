var request = require('request');
var async = require('async');

function getV1API(n, callback) {
    request('http://localhost:8888/v1/jobapi/Jobs/303090?keytoken=68656e6c65792061646d696e20636f6d70616e792064617461&Job%20%23=303090', callback);
}

//Run 10 calls
async.timesSeries(10, function(n, next) {
    console.log(n);
    getV1API(n, function(err, data) {
        next(err, data);
    })
}, function(err, results) {
    for (var i = 0; i < results.length; ++i) {
        console.log('#' + (i + 1) + "  " + results[i]);
    }

    //console.log(results);
});
