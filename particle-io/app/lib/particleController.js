var particleController = function(app) {

    console.log('> Loaded particleController.js');

    var bodyParser = require('body-parser');
    var dateFormat = require('dateformat');
    var _ = require('underscore');
    var ParticleData = require(__base + '/lib/particle-data');
    var particleData = new ParticleData();

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.get('/particle/list', function(req, res) {

        particleData.Find({}).then(function(result) {
            console.log(result);
            var pArray = [];
            _.each(result, function(item) {
                item.particleJSON = JSON.stringify(item.particle);
                pArray.push(item);
            });

            console.log(pArray);

            res.render('home', { particles : pArray });
        });

    });

    app.get('/api/particle', function(req, res) {
        res.send('Particle.io - Hello!');
    });

    //url eg. /api/Particle?group=[group]
    app.post('/api/particle', function(req, res) {

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

        particleData.Insert(particle);

        res.send(data);

    });

};

module.exports = particleController;