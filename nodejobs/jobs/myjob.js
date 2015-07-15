var Q = require('q');

module.exports.version = 1.0;
module.change_code = 1;

module.exports.Execute = function(jobID)
{
    var q = Q.defer();

    console.log('Init of myjob.js');

    //Set long running task
    var timerID = setTimeout(function () {
        var currTime2 = new Date();
        console.log('END Job #' + jobID  + ' : ' + currTime2);
        q.resolve();
    }, 15000)

    return q.promise;
};