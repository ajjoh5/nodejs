var fs = require('fs');
var path = require('path');
var Hapi = require('hapi');
var hotswap = require('hotswap');
var shortid = require('shortid');
var _ = require('underscore');

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

        var cronJob = {
            id : shortid.generate(),
            job : null,
            isActive : false,
            isRunning : false
        };

        var cJob = new CronJob({
            cronTime: '0 */1 * * * 1-5',
            onTick: function () {
                var thisJobID = cronJob.id;
                var currentCronJob = _.findWhere(jobs, {id: thisJobID});

                if(currentCronJob.isActive && !currentCronJob.isRunning)
                {
                    console.log('Running CronJob: ' + thisJobID);
                    currentCronJob.isRunning = true;

                    //Load in the file dynamically, then require it
                    var jobsDir = __dirname + '/jobs/';
                    var jobFile = path.join(jobsDir, filename);
                    //console.log(jobFile);

                    var reqJobFile = require(jobFile);
                    reqJobFile.Execute(thisJobID).then(function() {
                        currentCronJob.isRunning = false;
                        console.log('Finished CronJob: ' + thisJobID);
                    });

                    //var currTime = new Date();
                    //console.log('[5s] Interval Hit: ' + currTime);
                }
                else
                {
                    console.log('@@ BLOCKED - CronJob: ' + thisJobID);
                }
            },
            onComplete: function() {
                var thisJobID = cronJob.id;
                console.log('Completed CronJob ID: ' + thisJobID);
            },
            start: false,
            timeZone: "Australia/Melbourne"
        });

        cronJob.job = cJob;

        jobs.push(cronJob);

        console.log('Added CronJob ID: ' + cronJob.id);
        reply('Added Job ID: ' + cronJob.id);
    }
});

server.route({
    method: 'GET',
    path: '/StartJob/{id}',
    handler: function (request, reply) {

        var jobID = request.params.id;
        var cronJob = _.findWhere(jobs, {id: jobID});
        if(cronJob) {
            cronJob.isActive = true;
            cronJob.isRunning = false;
            cronJob.job.start();

            console.log('Starting Job ID: ' + jobID);
            reply('Starting Job ID: ' + jobID);
        }
    }
});

server.route({
    method: 'GET',
    path: '/StopJob/{id}',
    handler: function (request, reply) {

        var jobID = request.params.id;
        var cronJob = _.findWhere(jobs, {id: jobID});
        if(cronJob) {

            cronJob.isActive = false;
            cronJob.job.stop();

            console.log('Stopping Job ID: ' + jobID);
            reply('Stopping Job ID: ' + jobID);
        }
    }
});

server.route({
    method: 'GET',
    path: '/DeleteJob/{id}',
    handler: function (request, reply) {

        var jobID = request.params.id;
        var cronJob = _.findWhere(jobs, {id: jobID});
        if(cronJob) {

            cronJob.job.stop();
            jobs = _.without(jobs, cronJob);

            console.log('Deleting Job ID: ' + jobID);
            reply('Deleting Job ID: ' + jobID);
        }
    }
});

server.route({
    method: 'GET',
    path: '/JobStatus',
    handler: function (request, reply) {

        var allJobs = [];

        for(var i = 0; i < jobs.length; i++) {

            var job = jobs[i];

            var item = {
                id : job.id,
                isActive : job.isActive,
                isRunning : job.isRunning
            };

            allJobs.push(item);
        }

        reply(allJobs);
    }
});


// Start the server
server.start(function () {
    console.log('Server running at:', server.info.uri);
});