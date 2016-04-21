var particleController = function(app) {

    console.log('> Loaded particleController.js');

    var bodyParser = require('body-parser');
    var dateFormat = require('dateformat');

    app.get('/particles/:group', function(req, res) {

        var particleGroup = (!req.params.group) ? 'default' : req.params.group;

        res.render('particles', { group : particleGroup });

    });

    app.get('/login', function(req, res) {

        res.render('login', {});

    });
};

module.exports = particleController;