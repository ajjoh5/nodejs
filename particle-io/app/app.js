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
app.engine('.hbs', exphbs({extname: '.hbs', defaultLayout: 'main'}));
app.set('view engine', '.hbs');

console.log('Booting Controllers...');
require(__base + "/lib/particleController")(app);

//Create server on configured port
app.listen(appSettings.port, function() {
    art.font('particle', 'Doom', function(rendered){
        console.log(rendered);
        console.log('Port: '+ appSettings.port);
        console.log('Environment: ' + process.env.NODE_ENV);
    });
});