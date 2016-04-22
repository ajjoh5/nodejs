var particleController = function(app) {

    console.log('> Loaded particleController.js');

    var bodyParser = require('body-parser');
    var dateFormat = require('dateformat');
    var bearerToken = require('express-bearer-token');

    var ParticleFirebase = require(__base + '/lib/particle-firebase');
    var db = new ParticleFirebase();

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use(bearerToken());

    app.get('/up', function(req, res) {
        res.send('Particle.io - Hello!');
    });

    //url eg. /api/Particle
    app.post('/api/particle/new', function(req, res) {

        var particle = (!req.body) ? {} : req.body;
        var headers = (!req.headers) ? {} : req.headers;

        //Get user by user key
        console.log(req.token);
        db.GetUserByKey(req.token)
        .then(function(user) {
            res.send('found user');
        })
        .fail(function(err) {
            res.send('error');
        });


        // var data = {
        //     group : (!particle.group) ? 'default' : particle.group,
        //     created : dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT'),
        //     type : (!particle.type) ? 'info' : particle.type,
        //     particle : particle
        // };
        //
        // delete particle.group;
        // delete particle.type;
        //
        // //Insert data into database
        // db.Insert(data)
        // .then(function(result) {
        //     res.status(200).send(result);
        // }).fail(function (err) {
        //     res.status(500).send(err);
        // });
    });

};

module.exports = particleController;