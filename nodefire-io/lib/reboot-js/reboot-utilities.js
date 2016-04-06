var fs = require('fs');

function rbJsonFileSync(file) {
    try {
        var data = fs.readFileSync(file, 'utf8');
        return JSON.parse(data);
    }
    catch(ex) {
        var err = 'ERROR: Failed to read json file: ' + file;
        console.log(err);
        console.log(ex);
        throw err;
    }
}

module.exports.rbJsonFileSync = rbJsonFileSync;
