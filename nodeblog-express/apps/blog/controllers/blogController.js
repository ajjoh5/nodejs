//NodeJS Plugins
var path = require('path');

//app = express app
function blogController(app) {

    //init variables
    var appDir = path.dirname(require.main.filename);

    //App Custom Plugins
    var SPA = require(appDir + '/lib/SPA.js');
    var utilities = require(appDir + '/lib/utilities.js');

    //Express routes
    app.get('/blog/blog-page', function(req, res) {
        res.send('Got blog-page successfully');
    });

    // Generic Catch All Blog Article Views
    app.get('/blog/*', utilities.cmsMiddleware, function(req, res) {

        var urlParams = utilities.removeLastSlash(req.params[0]).split('/');

        //Create new single page app - "pages", with default view called "default"
        var spa = new SPA('blog', urlParams[0], 'blog-article', null, req.params);

        res.render(spa.viewFile, spa.viewParams);
    });

}

module.exports = blogController;