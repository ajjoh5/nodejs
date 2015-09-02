//NodeJS Plugins
var fs = require('fs');
var path = require('path');
var shortid = require('shortid');

function removeLastSlash(myUrl) {
    if (myUrl.substring(myUrl.length-1) === '/') {
        myUrl = myUrl.substring(0, myUrl.length-1);
    }

    return myUrl;
}

function splitUrl(myUrl) {
    if (myUrl.substring(myUrl.length-1) === '/') {
        myUrl = myUrl.substring(0, myUrl.length-1);
    }

    return myUrl;
}

function generateShortID() {
    return shortid.generate();
}

function formatDate(date) {
    var year = date.getFullYear(),
        month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1), // months are zero indexed
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds(),
        hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
        minuteFormatted = minute < 10 ? "0" + minute : minute,
        morning = hour < 12 ? "am" : "pm";

    if(month.length < 2){
        month = '0' + month;
    }

    if(day.length < 2){
        day = '0' + day;
    }

    //return year + "-" + month + "-" + day + "-" + hour + minuteFormatted;
    return '' + year + month + day + "-" + hour + minuteFormatted;
}

function loadAllSPAControllers(app, hbs) {
    //console.log('Loading controllers');

    var appDir = path.dirname(require.main.filename);
    var dir = appDir + '/apps/';
    var files = fs.readdirSync(dir);

    //cycle through apps
    for(var i in files) {
        var spaName = files[i];
        var spaDirectory = path.resolve(dir, spaName);

        //Register partials directory
        //var hbs = app.get('hbs');
        hbs.partialsDir.push(spaDirectory + '/views/partials/');

        var spaControllerFile = path.resolve(spaDirectory + '/controllers/', spaName + 'Controller.js');

        try {
            //dont load any controllers starting with a '_'
            if(spaName.indexOf('_') == -1 || spaName.indexOf('_') > 0)
            {
                var stats = fs.statSync(spaControllerFile);
                if (stats.isFile()) {
                    if (process.env.NODE_ENV == 'development' ) { console.log('Loading Controller: ' + spaControllerFile); }
                    require(spaControllerFile)(app);
                }
            }
        }
        catch(ex) {
            if (process.env.NODE_ENV == 'development' ) { console.log('Failed to load controller: ' + spaControllerFile); }
            console.log(ex);
        }
    }

}

function loadAppController(app, hbs, controller) {
    //console.log('Loading controllers');

    var appDir = path.dirname(require.main.filename);
    var controllerFile = appDir + '/apps/_app/controllers/' + controller + '.js';

    //Register partials directory
    hbs.partialsDir.push(appDir + '/apps/_app/views/partials/');

    if (process.env.NODE_ENV == 'development' ) { console.log('Loading APP Controller: ' + controller + '.js'); }

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
    if (process.env.NODE_ENV == 'development' ) { console.log('[ URL = ' + urlRequest + ' ]'); }

    next();
}


module.exports.removeLastSlash = removeLastSlash;
module.exports.splitUrl = splitUrl;
module.exports.formatDate = formatDate;
module.exports.generateShortID = generateShortID;
module.exports.loadAllSPAControllers = loadAllSPAControllers;
module.exports.loadAppController = loadAppController;
module.exports.cmsMiddleware = cmsMiddleware;