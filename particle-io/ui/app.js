//Plugins
var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var bodyParser = require('body-parser');
var art = require('ascii-art');

//init variables
var appDir = path.dirname(require.main.filename);
global.__base = appDir + '/';
var appSettings = {
    port: 5555
};

//Setup environment variable
process.env.NODE_ENV = 'development';

//Create & Configure express app
var app = express();
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
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
}));
app.set('view engine', '.hbs');

//Static Routes for Files
app.use('/css', express.static(__base + '/www/css'));
app.use('/images', express.static(__base + '/www/images'));
app.use('/js', express.static(__base + '/www/js'));
// app.use('*/app.js', function(req, res, next) {
//     res.sendFile(path.join(__dirname + '/apps/' + req.params[0] + '/app.js'));
// });
// app.use('*/favicon.ico', function(req, res, next) {
//     res.sendFile(path.join(__base + '/favicon.ico'));
// });
// app.use('*/sitemap.xml', function(req, res, next) {
//     res.sendFile(path.join(__base + '/sitemap.xml'));
// });
// app.use('*/robots.txt', function(req, res, next) {
//     res.sendFile(path.join(__base + '/robots.txt'));
// });

console.log('Booting Controllers...');
require(__base + "/code/particleController")(app);

//Create server on configured port
app.listen(appSettings.port, function() {
    art.font('particle', 'Doom', function(rendered){
        console.log(rendered);
        console.log('Port: '+ appSettings.port);
        console.log('Environment: ' + process.env.NODE_ENV);
    });
});