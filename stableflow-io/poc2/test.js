//Init vars
var path = require('path');

//Create global var __base for root path
global.__base = path.dirname(require.main.filename) + '/';

//Create RethinkDB handle
var rethinkDB = require('./lib/RethinkDB').create({});

rethinkDB.getDB(function(err, conn, r) {

    //If error in db init, exit
    if(err) { return console.log(err); }

    //query authors of table
    r.table('authors').run(conn, function(err, cursor) {
        if (err) throw err;
        cursor.toArray(function(err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result, null, 2));
        });
    });

});