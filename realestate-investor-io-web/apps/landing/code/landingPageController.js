
var landingPageController = function(app) {

    app.get('/', function(req, res) {

        var viewParams = {
            layout : __dirname + '/../views/layouts/layout',
            viewFile : __dirname + '/../views/index',
            message : 'NPM World'
        };

        res.render(viewParams.viewFile, viewParams);
    });
};

module.exports = landingPageController;