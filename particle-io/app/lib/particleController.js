var particleController = function(app) {

    console.log('> Loaded particleController.js');

    var bodyParser = require('body-parser');
    var dateFormat = require('dateformat');
    var Datastore = require('nedb');
    var ParticleData = require(__base + '/lib/particle-data');

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.get('/api/Particle', function(req, res) {
        res.send('Particle.io - Hello!');
    });

    //url eg. /api/Particle?group=[group]
    app.post('/api/Particle', function(req, res) {

        var particle = (!req.body) ? {} : req.body;

        var options = {
            group : (!particle.group) ? 'particles' : particle.group
        };

        var data = {
            type : (!particle.type) ? 'info' : particle.type,
            particle : particle,
            created : dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT')
        };

        delete particle.type;
        delete particle.group;

        var particleData = new ParticleData(options, data);

        res.send(data);

    });

};

module.exports = particleController;