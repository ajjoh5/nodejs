var Logger = require('le_node');

var log = new Logger({
    token:'649fdb7f-9375-4f0e-87f6-e9ddd848ecfc'
});


// level specific methods like 'info', 'debug', etc.
//log.info("I'm a Lumberjack and I'm OK");

// generic log method, also accepts JSON entries
//log.log("debug", {sleep:"all night", work:"all day"});

log.log("alert", {error: "Error happened with lead"});


console.log('Finished');