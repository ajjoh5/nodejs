//NodeJS Plugins
var path = require('path');

//app = express app
function blogController(app) {

    //init variables
    var appDir = path.dirname(require.main.filename);

    //App Custom Plugins
    var SPA = require(appDir + '/lib/SPA.js');
    var spav2 = require(appDir + '/lib/spav2.js');
    var utilities = require(appDir + '/lib/utilities.js');

    function newBlog() {
        var sid = utilities.generateShortID();

        //Class Template
        return {
            name : 'New Blog ID - ' + sid,
            url : 'new-blog-' + sid,
            contents: [
                {
                    name: "article-text",
                    value: "article text here"
                }
            ],
            properties : [
                {
                    "name": "meta-description",
                    "description": "The meta-description must contain the primary keyword / phrase and be no longer than 156 characters",
                    "value": "meta-description here"
                },
                {
                    "name": "page-title",
                    "description": "The page title must contain the primary keyword / phrase and be no longer than 70 characters",
                    "value": "New Node ID - " + sid
                },
                {
                    name: "more-text",
                    value: "more text here"
                },
                {
                    name: "featured-image",
                    value: "http://image"
                },
                {
                    name: "author",
                    value: "Admin"
                },
                {
                    name: "publish-date",
                    value: utilities.formatDate(new Date())
                }
            ]
        };
    }

    // [ NEW ] - Blog
    app.get('/blog/new', utilities.cmsMiddleware, function(req, res) {

        var blog = newBlog();

        var app = {
            name : 'blog',
            view : blog.url,
            viewFile : 'blog-article',
            layoutFile : 'layout',
            params : req.params
        };

        //init spa
        spav2.initSPA(app);

        //Save the new blog and redirect to it
        spav2.newSPA(app, blog, function(err, data) {
            res.redirect(app.view);
        });
    });

    // Root View + Root EDIT view
    app.get('/blog(/edit)?', utilities.cmsMiddleware, function(req, res) {

        var app = {
            name : 'blog',
            isRoot : true,
            params : req.params
        };

        var viewParams = spav2.initSPA(app);

        res.render(app.viewFile, viewParams);
    });

    // Generic Catch All Blog Article Views
    app.get('/blog/*', utilities.cmsMiddleware, function(req, res) {

        var urlParams = utilities.removeLastSlash(req.params[0]).split('/');

        var app = {
            name : 'blog',
            view : urlParams[0],
            viewFile : 'blog-article',
            params : req.params
        };

        var viewParams = spav2.initSPA(app);

        res.render(app.viewFile, viewParams);
    });

}

module.exports = blogController;