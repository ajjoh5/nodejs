//NodeJS Plugins
var fs = require('fs');
var path = require('path');

//Express Plugins
var express = require('express');
var compress = require('compression');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');

//App Custom Plugins
var utilities = require('./lib/utilities.js');

//Setup environment variable
process.env.NODE_ENV = 'development';

//Create & Configure express app
var app = express();

//Used compression in the app
app.use(compress());

hbs = exphbs.create({
    extname:'handlebars',
    defaultLayout: 'layout',
    partialsDir: ['views/partials/'],
    layoutsDir: 'views/layouts/',
    helpers: {
        block: function (name) {
            var blocks  = this._blocks,
                content = blocks && blocks[name];

            return content ? content.join('\n') : null;
        },

        contentFor: function (name, options) {
            var blocks = this._blocks || (this._blocks = {}),
                block  = blocks[name] || (blocks[name] = []);

            block.push(options.fn(this));
        }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: true }));
//app.set('hbs', hbs);

//Static Routes for Files
app.use('/css', express.static('www/css'));
app.use('/images', express.static('www/images'));
app.use('/js', express.static('www/js'));
app.use('*/app.js', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/apps/' + req.params[0] + '/app.js'));
});
app.use('*/favicon.ico', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/favicon.ico'));
});
app.use('*/sitemap.xml', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/sitemap.xml'));
});
app.use('*/robots.txt', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/robots.txt'));
});

// init app controllers and routes
utilities.loadAppController(app, hbs, '_loginController');

// - load SPA controllers
utilities.loadAllSPAControllers(app, hbs);

utilities.loadAppController(app, hbs, '_appController');

// Blitz.io custom route for performance testing
app.get('/mu-eeb1fd94-84ab7240-46461b0f-c4b91a94', function(req, res) {

    res.send('42');
});

//Create server on 3001
app.listen(3001, function() {
    console.log('Server running at: 3001');
});