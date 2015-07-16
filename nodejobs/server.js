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


//Utilities
function SaveJobsFile(jobsArray) {
    var configFile = __dirname + '/config/config.json';

    var allJobs = [];

    for(var i = 0; i < jobs.length; i++) {

        var job = jobs[i];

        var item = {
            id : job.id,
            filename : job.filename,
            cronTiming : job.cronTiming,
            isActive : job.isActive,
            isRunning : job.isRunning
        };

        allJobs.push(item);
    }

    fs.writeFile(configFile, JSON.stringify(allJobs), function(err) {
        if(err) {
            console.log(err);
            return false
        }

        console.log(configFile + ' file saved.');
    });

    return true;
}

function AddExistingJobs() {
    var configFile = __dirname + '/config/config.json';
    var config = [];

    fs.readFile(configFile, 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }

        if(data) {
            //Get the Config JSON array
            config = JSON.parse(data);

            _.each(config, function (item) {
                AddConfigJobToArray(item);
            });
        }
    });
}

function AddConfigJobToArray(job) {

    var cronJob = {
        id : job.id,
        job : null,
        filename : job.filename,
        cronTiming : job.cronTiming,
        isActive : job.isActive,
        isRunning : job.isRunning
    };

    var cJob = new CronJob({
        cronTime: cronJob.cronTiming,
        onTick: function () {
            var thisJobID = cronJob.id;
            var currentCronJob = cronJob;

            if(currentCronJob.isActive && !currentCronJob.isRunning)
            {
                console.log('Running CronJob: ' + thisJobID);
                currentCronJob.isRunning = true;

                //Load in the file dynamically, then require it
                var jobsDir = __dirname + '/jobs/';
                var jobFile = path.join(jobsDir, currentCronJob.filename);
                //console.log(jobFile);

                var reqJobFile = require(jobFile);
                reqJobFile.Execute(thisJobID).then(function() {
                    currentCronJob.isRunning = false;
                    console.log('Finished CronJob: ' + thisJobID);
                });
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

    if(cronJob.isActive == true) {
        cronJob.job.start();
        console.log('Starting Job ID: ' + cronJob.id);
    }
}

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
            filename : filename,
            cronTiming : '0 */1 * * * 1-5',
            isActive : false,
            isRunning : false
        };

        var cJob = new CronJob({
            cronTime: cronJob.cronTiming,
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
        var success = SaveJobsFile(jobs);

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

            //Save changes to config
            var success = SaveJobsFile(jobs);

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

            //Save changes to config
            var success = SaveJobsFile(jobs);

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

            //Save changes to config
            var success = SaveJobsFile(jobs);

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
                filename : job.filename,
                cronTiming : job.cronTiming,
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
    AddExistingJobs();
});