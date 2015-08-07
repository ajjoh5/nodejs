//NodeJS Plugins
var fs = require('fs');
var path = require('path');

//Express Plugins
var express = require('express');
var compress = require('compression');
var exphbs = require('express-handlebars');

//Other plugins
var requestify = require('requestify');
var bodyParser = require('body-parser');
var _ = require('underscore');

//App Custom Plugins
var SPA = require('./SPA.js');
var utilities = require('./utilities.js');

//Create & Configure express app
var app = express();
app.use(compress());

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
app.use(bodyParser.urlencoded({ extended: true }));


//Static Routes for Files
app.use('/css', express.static('www/css'));
app.use('/js', express.static('www/js'));
app.use('*/app.js', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/' + req.params[0] + '/app.js'));
});
app.use('*/favicon.ico', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/favicon.ico'));
});


//Mail Sender
app.post('/mail/send', function(req, res) {

    console.log('Sending Email...');

    //Your domain, from the Mailgun Control Panel
    var domain = 'mg.adamjohnstone.co';

    //Your sending email address post data
    var sender = req.body.name + ' <' + req.body.email + '>';
    var mailedFrom = 'contact@adamjohnstone.co';
    var recipients = 'ajjoh5@gmail.com';
    var message = 'Contact Details: \n' + sender + '\n\nMessage:' + req.body.message;

    var options = {
        auth: {
            username: 'api',
            password: 'key-74bcec52b1dd582c2989aec6022ce95d'
        },
        dataType: 'form-url-encoded'
    };


    var data = {
        from : mailedFrom,
        to : recipients,
        subject : 'AdamJohnstone.co - Contact Request Submitted',
        text : message
    };

    requestify.post('https://api.mailgun.net/v3/' + domain + '/messages', data, options)
    .then(function(response) {
        // Get the response body
        var body = response.getBody();
        console.log(body);

        res.send(body);
    });
});

app.get('/mu-eeb1fd94-84ab7240-46461b0f-c4b91a94', function(req, res) {

    res.send('42');
});

app.get('/', function(req, res) {

    //Create new single page app - "pages", with default view called "default"
    var spa = new SPA('pages', 'about-me');

    //Render the single page app from the spa params
    res.render(spa.viewFile, spa.viewParams);
});

app.get('/?*', function(req, res) {

    //init utilities
    var u = new utilities();

    //get url params
    var params = u.removeLastSlash(req.params[0]).split('/');

    //Create new single page app based on params
    var spa = new SPA(params[0], params[1], params);
    //console.log(spa.viewParams);

    res.render(spa.viewFile, spa.viewParams);
});

//Mail Sender
app.post('/?*/save', function(req, res) {

    //init utilities
    var u = new utilities();

    //get url params
    var params = u.removeLastSlash(req.params[0]).split('/');

    var contentArray = req.body.content;
    var outputFileLocation = path.join(__dirname + '/content/' + params[0] + '.json');

    var contentFileLocation = path.join(__dirname + '/content/' + params[0] + '.json');
    var data = fs.readFileSync(contentFileLocation, 'utf8');
    var json = JSON.parse(data);

    var node = _.find(json.nodes, function (nItem) {
        return nItem.name === params[1];
    });

    var oldNodeContent = _.reject(node.content, function(item) {
        return item.name.indexOf('content.') > -1
    });

    node.content = oldNodeContent.concat(contentArray);
    //console.log(node);

    fs.writeFile(outputFileLocation, JSON.stringify(json), function(err) {
        if(err) {
            return console.log(err);
        }

        res.send('File was successfully saved.')
    });

    //var sender = req.body.name + ' <' + req.body.email + '>';
    //var mailedFrom = 'contact@adamjohnstone.co';
    //var recipients = 'ajjoh5@gmail.com';
    //var message = 'Contact Details: \n' + sender + '\n\nMessage:' + req.body.message;

    //res.send(body);
});

app.listen(3001, function() {
    console.log('Server running at: 3001');
});