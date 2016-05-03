var particleController = function(app) {

    console.log('> Loaded particleController.js');

    var bodyParser = require('body-parser');
    var dateFormat = require('dateformat');
    var bearerToken = require('express-bearer-token');

    var db = require(__base + './lib/particle-firebase.js').createDB();

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(bearerToken());

    app.get('/up', function(req, res) {
        res.send('Particle.io - Hello!');
    });

    //url eg. /api/particles/new -> with json object sent
    app.post('/api/particles/new', function(req, res) {

        var particle = (!req.body) ? {} : req.body;

        //Get user by user key
        //console.log('Bearer = ' + req.token);
        db.insertParticle(req.token, particle, function(err, data) {

            if(err) {
                return res.status(500).send(err);
            }

            return res.status(200).send(data);
        });
    });

    //count how many logs in a group
    app.get('/api/particles/count/:group?', function(req, res) {

        var group = (!req.params.group) ? null : req.params.group;

        db.getParticlesByGroup(req.token, group, function(err, data) {

            if(err) {
                return res.status(500).send(err);
            }

            return res.status(200).send('Count: ' + data.length);
        });
    });

    //url eg. /api/particles/new.group.searched, /api/particles/group2
    app.get('/api/particles/:group?', function(req, res) {

        var group = (!req.params.group) ? null : req.params.group;

        db.getParticlesByGroup(req.token, group, function(err, data) {

            if(err) {
                return res.status(500).send(err);
            }

            return res.status(200).send(data);
        });
    });

    //url eg. /api/hooks/new -> with json object sent
    // if override existing hook - supply 'id' in the fields with the hook's ID
    // json => { name : 'hook1', field: '__type', hookValue : 'error', file: 'javascript contents here' }
    app.post('/api/hooks/new', function(req, res) {

        var hook = (!req.body) ? {} : req.body;

        db.insertHook(req.token, hook, function(err, data) {

            if(err) {
                return res.status(500).send(err);
            }

            return res.status(200).send(data);
        });
    });

    //url eg. /api/Particle
    app.get('*?', function(req, res) {

        res.status(404).send('Not found');
    });
};

module.exports = particleController;