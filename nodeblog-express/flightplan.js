var plan = require('flightplan');

var appName = 'nodeblog-express';
var username = 'www-node';
var startFile = 'server.js';
var pmSettingsFile = 'pm2settings.json';

var tmpDir = appName + '-' + new Date().getTime();

// configuration
plan.target('staging', [
    {
        host: '104.236.52.243',
        username: username,
        agent: process.env.SSH_AUTH_SOCK
    }
]);

plan.target('production', [
    {
        host: '104.236.52.243',
        username: username,
        agent: process.env.SSH_AUTH_SOCK
    },
//add in another server if you have more than one
// {
//   host: '104.131.93.216',
//   username: username,
//   agent: process.env.SSH_AUTH_SOCK
// }
]);

// run commands on localhost
plan.local(function(local) {
    // uncomment these if you need to run a build on your machine first
    // local.log('Run build');
    // local.exec('gulp build');

    local.log('Copy files to remote hosts');
    var filesToCopy = local.exec('git ls-files', {silent: true});
    // rsync files to all the destination's hosts
    local.transfer(filesToCopy, '/tmp/' + tmpDir);
});

// run commands on remote hosts (destinations)
plan.remote(function(remote) {
    remote.log('Move folder to root');
    remote.sudo('cp -R /tmp/' + tmpDir + ' ~', {user: username});
    remote.rm('-rf /tmp/' + tmpDir);

    remote.log('Install dependencies');
    remote.sudo('npm --production --prefix ~/' + tmpDir + ' install ~/' + tmpDir, {user: username});

    remote.log('Reload application');
    remote.sudo('ln -sfn ~/' + tmpDir + ' ~/'+appName, {user: username});

    //remote.log('Restart PM2 Process');
    //remote.exec('pm2 reload ' + appName, {failsafe: true});

    remote.log('Restart PM2 Process');
    remote.exec('pm2 stop ' + appName + '/' + pmSettingsFile, {failsafe: true});
    remote.exec('pm2 start ' + appName + '/' + pmSettingsFile);
});