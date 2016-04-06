var rebootjs = require('reboot-js');

var rebootConfig = {
    "port" : 8888,
    "env" : "development",
    "reboot-apps-directory" : "apps",
    "reboot-www-directory" : "apps/www",
    "default-layout" : "layout",
    "default-viewfile" : "index",
    "partials-directory" : "views/partials/",
    "layouts-directory" : "views/layouts/"
};

rebootjs.go(rebootConfig);