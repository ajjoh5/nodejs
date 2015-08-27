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

function loadAppController(app) {
    //console.log('Loading controllers');

    var appDir = path.dirname(require.main.filename);
    var controllerFile = appDir + '/apps/_app/controllers/_appController.js';

    require(controllerFile)(app);
}

function loadLoginController(app) {
    //console.log('Loading controllers');

    var appDir = path.dirname(require.main.filename);
    var controllerFile = appDir + '/apps/_login/controllers/_loginController.js';

    require(controllerFile)(app);
}


module.exports.removeLastSlash = removeLastSlash;
module.exports.loadAllSPAControllers = loadAllSPAControllers;
module.exports.loadAppController = loadAppController;
module.exports.loadLoginController = loadLoginController;
