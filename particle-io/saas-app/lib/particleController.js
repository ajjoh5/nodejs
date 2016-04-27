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

    //url eg. /api/Particle
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

    //url eg. /api/Particle
    app.get('/api/particles/:group?', function(req, res) {

        var group = (!req.params.group) ? null : req.params.group;

        db.getParticlesByGroup(req.token, group, function(err, data) {

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