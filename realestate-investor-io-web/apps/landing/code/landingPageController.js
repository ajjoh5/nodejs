
var landingPageController = function(app) {

    app.get('/', function(req, res) {

        var viewParams = {
            layout : __dirname + '/../views/layouts/layout',
            viewFile : __dirname + '/../views/index',
            'action-button' : 'BUY NOW'
        };

        res.render(viewParams.viewFile, viewParams);
    });

    app.get('/deals-home', function(req, res) {

        var viewParams = {
            layout : __dirname + '/../views/layouts/layout',
            viewFile : __dirname + '/../views/deals-home',
            'action-button' : '<span class="glyphicon glyphicon-user" aria-hidden="true"></span> Logout'
        };

        res.render(viewParams.viewFile, viewParams);
    });
};

module.exports = landingPageController;