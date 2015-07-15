module.exports.version = 1.0;
module.change_code = 1;

module.exports.Execute = function(jobID)
{
    //Set long running task
    var timerID = setTimeout(function () {
        var currTime2 = new Date();
        console.log('END Job #' + jobID  + ' : ' + currTime2);
    }, 1000)
};