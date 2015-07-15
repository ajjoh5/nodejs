var fs = require('fs');
var path = require('path');
var Hapi = require('hapi');
var hotswap = require('hotswap');

var jobIDPool = 0;
var jobs = [];

//Monitor and Hot Swap changed files
hotswap.on('swap', function() {
    console.log('Swapped...');
});

//Cron Jobs -- cronTime: '*/5 * * * * *',
var CronJob = require('cron').CronJob;

var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 3001
});


//Handle New Cron Job Route
server.route({
    method: 'GET',
    path: '/AddJob/{filename}',
    handler: function (request, reply) {

        var filename = request.params.filename;
        console.log('Adding job to array...');

        var cronJob = {
            id : jobIDPool++,
            job : null,
            isActive : false,
            isRunning : false
        };

        var cJob = new CronJob({
            cronTime: '*/5 * * * * 1-5',
            onTick: function () {
                var thisJobID = cronJob.id;
                console.log('CronJob #: ' + thisJobID);
                jobs[thisJobID].isRunning = true;

                //Load in the file dynamically, then require it
                var jobsDir = __dirname + '/jobs/';
                var jobFile = path.join(jobsDir, filename);
                console.log(jobFile);

                var reqJobFile = require(jobFile);
                reqJobFile.Execute(thisJobID);

                //var currTime = new Date();
                //console.log('[5s] Interval Hit: ' + currTime);
            },
            onComplete: function() {
                console.log('Finished Job...');
            },
            start: false,
            timeZone: "Australia/Melbourne"
        });

        cronJob.job = cJob;

        jobs.push(cronJob);

        reply('Added Job #:' + cronJob.id);
    }
});

server.route({
    method: 'GET',
    path: '/StartJob/{id}',
    handler: function (request, reply) {

        var jobID = request.params.id;
        jobs[jobID].isActive = true;
        jobs[jobID].isRunning  = false;
        jobs[jobID].job.start();

        console.log('Starting Job #: ' + jobID);
        reply('Starting Job #: ' + jobID);
    }
});


// Start the server
server.start(function () {
    console.log('Server running at:', server.info.uri);
});