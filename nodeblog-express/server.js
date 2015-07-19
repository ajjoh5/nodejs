var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');

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

var spa = {
    id : 'blog',
    filepath : __dirname + '/blog'
}

//app.get('/api/?*', function (req, res) {
//    //console.log(req.path);
//    //console.log(req.params);
//    var params = removeLastSlash(req.params[0]).split('/');
//    console.log(params);
//    //res.send('Multi Segment Routes...');
//    res.render(__dirname + '/jobs/test.handlebars', { layout: 'main2' });
//});

app.get('/', function(req, res) {
    //var params = removeLastSlash(req.params[0]).split('/');

    console.log('yep home');

    res.render(spa.filepath + '/home', {
        layout : spa.filepath + '/layouts/blog',
        spa: spa,
        title: 'NodeJobs.UI',
        brand: 'NodeBlog'
    });
});

//Static Routes for Files
app.use('/blog', express.static('blog/www'));
app.use('/js', express.static('www/js'));

app.listen(3001, function() {
    console.log('Server running at: 3001');
});