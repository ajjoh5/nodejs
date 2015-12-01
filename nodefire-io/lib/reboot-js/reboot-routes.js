var path = require('path');

var express = require('express');

function init(app, rebootConfig) {

    function cmsMiddleware(req, res, next) {
        //req.params.isAuthenticated = false;
        //req.params.isEditModeOn = false;
        //
        ////If user is authenticated, set params 'isAuthenticated' = true
        //if(req.session.username) {
        //    //user successfully logged in - set new request variable
        //    req.params.isAuthenticated = true;
        //}
        //
        //var urlRequest = req.params[0];
        //if(urlRequest && urlRequest.toUpperCase().indexOf('EDIT') > -1)
        //{
        //    req.params.isEditModeOn = true;
        //}
        //
        ////console.log('[ Authenticated = ' + req.params.isAuthenticated + ' ]');
        //if (process.env.NODE_ENV == 'development' ) { console.log('[ URL = ' + urlRequest + ' ]'); }

        next();
    }

    function removeLastSlash(myUrl) {
        if (myUrl.substring(myUrl.length-1) === '/') {
            myUrl = myUrl.substring(0, myUrl.length-1);
        }

        return myUrl;
    }

    function initApp(requestApp) {

        var retval = '';
        if(!requestApp.view) { requestApp.view = 'index'; }
        if(!requestApp.layout) { requestApp.layout = 'layout'; }


        if(requestApp) {
            var rootDir = path.dirname(require.main.filename);
            var dir = rootDir + '/' + rebootConfig['reboot-apps-directory'];
            var appDir = path.resolve(dir, requestApp.name);
            requestApp.viewFile = path.resolve(appDir, 'views/' + requestApp.view);
            requestApp.layout = path.resolve(appDir, 'views/layouts/' + requestApp.layout);

            console.log(requestApp.viewFile);

            retval = requestApp;
        }

        return retval;
    }

    //Static Routes for Files
    app.use('/css', express.static(__base + '/apps/www/css'));
    app.use('/images', express.static(__base + '/apps/www/images'));
    app.use('/js', express.static(__base + '/apps/www/js'));
    app.use('*/app.js', function(req, res, next) {
        res.sendFile(path.join(__dirname + '/apps/' + req.params[0] + '/app.js'));
    });
    app.use('*/favicon.ico', function(req, res, next) {
        res.sendFile(path.join(__base + '/favicon.ico'));
    });
    app.use('*/sitemap.xml', function(req, res, next) {
        res.sendFile(path.join(__base + '/sitemap.xml'));
    });
    app.use('*/robots.txt', function(req, res, next) {
        res.sendFile(path.join(__base + '/robots.txt'));
    });

    // Generic Catch All (put in last)
    app.get('/?*', cmsMiddleware, function(req, res) {

        var urlParams = removeLastSlash(req.params[0]).split('/');

        var requestApp = {
            name : urlParams[0],
            view : urlParams[1],
            params : req.params
        };

        var viewParams = initApp(requestApp);

        res.render(requestApp.viewFile, viewParams);
    });
}

module.exports.init = init;
