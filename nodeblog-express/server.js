var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var requestify = require('requestify');
var bodyParser = require('body-parser');

var SPA = require('./SPA.js');
var utilities = require('./utilities.js');

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
app.use(bodyParser.urlencoded({ extended: false }));


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
    var spa = new SPA(params[0], params[1]);


    //TODO: Create MongoDB function to get this info from the database
    //TODO: Add in views for the blog article and shop product
    spa.viewParams.products = [{
        slug: 'book-multipage-angular-apps-in-nodjs',
        featuredImage : 'http://www.tcgen.com/wp-content/uploads/2013/03/book-shadow-2.png',
        title: 'Multi-Page Angular Apps in NodeJS',
        author: 'Adam Johnstone',
        publishDate: '11-04-2015',
        readMore: 'Innovation of products is something that does blah and more blah. Innovation of products is something that does blah and more blah. Innovation of products is something that does blah and more blah. Innovation of products is something that does blah and more blah. Innovation of products is something that does blah and more blah.',
        blog: 'This is the start of something'
    },
    {
        slug: 'lean-startup',
        featuredImage : 'http://www.inc.com/uploaded_files/image/feature-57-the-lean-startup-book-pop_10909.jpg',
        title: 'Choose the Lean Startup as your Architecture',
        author: 'Adam Johnstone',
        publishDate: '11-08-2015 5:15pm',
        readMore: 'What an amazing 6 months its been, moving from single page apps into a multi page tiered architecture. Reading the lean startup really helped me see what I wanted to do more clearly, as it opened up the possibility that we can work on multiple applications all at one time.',
        blog: 'This is the start of something'
    }];

    spa.viewParams.blogs = [{
        slug: 'multiple-single-page-applications-in-nodejs',
        featuredImage : 'http://greenconcepts.com.au/wp-content/uploads/2012/08/featured-11.jpg',
        title: 'Multiple Single Page Applications, in one NodeJS application',
        author: 'Adam Johnstone',
        publishDate: 'Yesterday 1:00pm',
        readMore: 'What an amazing 6 months its been',
        blog: 'This is the start of something'
    },
    {
        slug: 'important-to-choose-right-architecture',
        featuredImage : 'http://www.visitnsw.com/nsw-tales/wp-content/uploads/2013/10/A-Heavenly-Aura-Cows-in-the-Hawkesbury-Image-Credit-Rhys-Pope2-380x210.jpg',
        title: 'Why is it important to choose the right Architecture',
        author: 'Adam Johnstone',
        publishDate: '11-08-2015 5:15pm',
        readMore: 'What an amazing 6 months its been',
        blog: 'This is the start of something'
    }];

    res.render(spa.viewFile, spa.viewParams);
});

app.listen(3001, function() {
    console.log('Server running at: 3001');
});