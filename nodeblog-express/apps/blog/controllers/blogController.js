//NodeJS Plugins
var path = require('path');

//app = express app
function blogController(app) {

    //init variables
    var appDir = path.dirname(require.main.filename);

    //App Custom Plugins
    var SPA = require(appDir + '/lib/SPA.js');

    function userMiddleware(req, res, next) {
        req.params.isAuthenticated = false;

        //If user is authenticated, set params 'isAuthenticated' = true
        if(req.session.username) {
            //user successfully logged in - set new request variable
            req.params.isAuthenticated = true;
        }

        next();
    }

    //Express routes
    app.get('/blog/blog-page', function(req, res) {
        res.send('Got blog-page successfully');
    });

    // Generic Catch All Blog Article Views
    app.get('/blog/?*', userMiddleware, function(req, res) {

        //Create new single page app based on params
        req.params[0] = 'blog/' + req.params[0];
        var spa = new SPA(req.params);

        var blogArticleViewFile = spa.viewParams.spa.viewpath + '/blog-article';

        res.render(blogArticleViewFile, spa.viewParams);
    });

}

module.exports = blogController;