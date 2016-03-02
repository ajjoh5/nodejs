var fs = require('fs');
var rebootjs = require('reboot-js');

var rebootConfig = {
    "port" : 7000,
    "env" : "development",
    "reboot-apps-directory" : "apps",
    "reboot-www-directory" : "apps/www",
    "default-layout" : "layout",
    "default-viewfile" : "index",
    "partials-directory" : "views/partials/",
    "layouts-directory" : "views/layouts/"
};

rebootjs.go(rebootConfig);