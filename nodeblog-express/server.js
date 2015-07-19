var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var Pages = require('./pages/pages.js');

//Create & Configure express app
var app = express();
hbs = exphbs.create({
    extname:'handlebars',
    defaultLayout: 'layout',
    partialsDir: "views/partials/",
    layoutsDir: "views/layouts/",
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

//Utilities
function removeLastSlash (myUrl)
{
    if (myUrl.substring(myUrl.length-1) === '/') {
        myUrl = myUrl.substring(0, myUrl.length-1);
    }

    return myUrl;
}

//var spa = {
//    id : 'pages',
//    filepath : __dirname + '/pages',
//    params : []
//};

//Static Routes for Files
app.use('/css', express.static('www/css'));
app.use('/js', express.static('www/js'));


//app.get('/api/?*', function (req, res) {
//    //console.log(req.path);
//    //console.log(req.params);
//    var params = removeLastSlash(req.params[0]).split('/');
//    console.log(params);
//    //res.send('Multi Segment Routes...');
//    res.render(__dirname + '/jobs/test.handlebars', { layout: 'main2' });
//});

app.get('/', function(req, res) {

    var p = new Pages();

    res.render(p.viewFile, p.viewParams);
});

//app.get('/?*', function(req, res) {
//    var params = removeLastSlash(req.params[0]).split('/');
//    console.log(params);
//
//    spa.id = params[0];
//    spa.filepath = __dirname + "/" + params[0];
//
//    var viewParams = {
//        layout : spa.filepath + '/layouts/default',
//        spa: spa,
//        title: 'About Me',
//        brand: 'Adam Johnstone'
//    };
//
//    var view = spa.filepath + '/' + params[1];
//
//    res.render(view, viewParams);
//});

app.listen(3001, function() {
    console.log('Server running at: 3001');
});