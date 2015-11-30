var adminController = function(app) {

    // Generic Catch All SPA Views (put in last)
    app.get('/admin/?', function(req, res) {

        var viewParams = {
            layout : __dirname + '/../views/layouts/layout',
            viewFile : __dirname + '/../views/index'
        };

        //res.send('1 was selected');
        res.render(viewParams.viewFile, viewParams);
    });
}

module.exports = adminController;