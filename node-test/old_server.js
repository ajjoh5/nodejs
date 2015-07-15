var hotswap = require('hotswap');
var fs = require('fs');
var path = require('path');

hotswap.on('swap', function() {
    // we are going to console.log(test) whenever it's changed
    console.log('Swapped: ' + test.version);
});

var isRunningJob = 0;
var jobID = 0;

//Cron Jobs -- cronTime: '*/5 * * * * *',
var CronJob = require('cron').CronJob;
var job = new CronJob({
    cronTime: '0 */6 * * * 1-5',
    onTick: function () {
        var currTime = new Date();
        console.log('Interval Hit: ' + currTime);

        if(isRunningJob === 0)
        {
            jobID++;
            console.log('!! FREE');
            isRunningJob = 1;
            RunJob(jobID);
        }
        else
        {
            console.log('@@ BLOCKED');
        }
    },
    onComplete: function() {
        console.log('Finished Job #: ' + jobID);
    },
    start: false,
    timeZone: "Australia/Melbourne"
});

job.start();

var every = require('schedule').every;
every('5s').do(function() {
    var jobsDir = __dirname + '/jobs/';
    fs.readdirSync(jobsDir).forEach(function (file) {
        ///* If its the current file ignore it */
        //if (file === 'index.js') return;

        /* Store module with its name (from filename) */
        //module.exports[path.basename(file, '.js')] = require(path.join(__dirname, file));
        console.log(path.join(jobsDir, file));
        require(path.join(jobsDir, file));
    });
});

//ms, millisecond, milliseconds
//s, second, seconds
//m, minite, minites
//h, hour, hours
//d, day, days
