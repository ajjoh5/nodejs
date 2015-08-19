//any global variables go here

//app = express app
function blogController(app) {

    //Express routes
    app.get('/blog/blog-page', function(req, res) {
        res.send('Got blog-page successfully');
    });

}

module.exports = blogController;