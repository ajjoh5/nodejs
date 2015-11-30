var fs = require('fs');

function rbJsonFileSync(file) {
    try {
        var data = fs.readFileSync(file, 'utf8');
        return JSON.parse(data);
    }
    catch(ex) {
        var err = 'ERROR: Failed to read reboot config file: ' + file;
        console.log(err);
        console.log(ex);
        throw err;
    }
}

function rbIsDev() {
    if(process.env.NODE_ENV = 'development') {
        return true;
    }
}

module.exports.rbJsonFileSync = rbJsonFileSync;
module.exports.rbIsDev = rbIsDev;
