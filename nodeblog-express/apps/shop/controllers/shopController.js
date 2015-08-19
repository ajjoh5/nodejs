//any global variables go here

//app = express app
function shopController(app) {

    //Express routes
    app.get('/shop/shop-page', function(req, res) {
        res.send('Got shop-page successfully');
    });

}

module.exports = shopController;