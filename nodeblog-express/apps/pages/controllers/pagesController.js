//any global variables go here

//app = express app
function pagesController(app) {

    //Express routes
    app.get('/pages/my-page', function(req, res) {
       res.send('Got my-page successfully');
    });

}

module.exports = pagesController;