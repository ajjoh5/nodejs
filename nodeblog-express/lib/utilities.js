//NodeJS Plugins
var fs = require('fs');
var path = require('path');

function removeLastSlash(myUrl) {
    if (myUrl.substring(myUrl.length-1) === '/') {
        myUrl = myUrl.substring(0, myUrl.length-1);
    }

    return myUrl;
}

function loadAllSPAControllers(app) {
    //console.log('Loading controllers');

    var appDir = path.dirname(require.main.filename);
    var dir = appDir + '/apps/';
    var files = fs.readdirSync(dir);

    //cycle through apps
    for(var i in files) {
        var spaName = files[i];
        var spaDirectory = path.resolve(dir, spaName);
        var spaControllerFile = path.resolve(spaDirectory + '/controllers/', spaName + 'Controller.js');

        try {
            //dont load any controllers starting with a '_'
            if(spaName.indexOf('_') == -1 || spaName.indexOf('_') > 0)
            {
                var stats = fs.statSync(spaControllerFile);
                if (stats.isFile()) {
                    console.log('Loading Controller: ' + spaControllerFile);
                    require(spaControllerFile)(app);
                }
            }
        }
        catch(ex) {
            console.log('Failed to load controller: ' + spaControllerFile);
            console.log(ex);
        }
    }

}

function loadAppController(app, controller) {
    //console.log('Loading controllers');

    var appDir = path.dirname(require.main.filename);
    var controllerFile = appDir + '/apps/_app/controllers/' + controller + '.js';
    console.log('Loading APP Controller: ' + controller + '.js');

    require(controllerFile)(app);
}

function cmsMiddleware(req, res, next) {
    req.params.isAuthenticated = false;
    req.params.isEditModeOn = false;

    //If user is authenticated, set params 'isAuthenticated' = true
    if(req.session.username) {
        //user successfully logged in - set new request variable
        req.params.isAuthenticated = true;
    }

    var urlRequest = req.params[0];
    if(urlRequest && urlRequest.toUpperCase().indexOf('EDIT') > -1)
    {
        req.params.isEditModeOn = true;
    }

    //console.log('[ Authenticated = ' + req.params.isAuthenticated + ' ]');

    next();
}


module.exports.removeLastSlash = removeLastSlash;
module.exports.loadAllSPAControllers = loadAllSPAControllers;
module.exports.loadAppController = loadAppController;
module.exports.cmsMiddleware = cmsMiddleware;