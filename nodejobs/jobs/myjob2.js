var Q = require('q');

module.exports.version = 1.0;
module.change_code = 1;

module.exports.Execute = function(jobID)
{
    var q = Q.defer();

    console.log('222 - Init of myjob2.js');

    //Set long running task
    var timerID = setTimeout(function () {
        var currTime2 = new Date();
        console.log('END Job #' + jobID  + ' : ' + currTime2);
        q.resolve();
    }, 5000)

    return q.promise;
};