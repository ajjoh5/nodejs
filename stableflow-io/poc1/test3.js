var r = require('rethinkdb');

function initDB(callback) {
    r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
        if (err) { callback(err, null); }
        else { callback(null, conn); }
    });
}

function closeConnection(conn) {
    conn.close();
}

initDB(function(err, conn) {
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

    //query authors of table
    r.table('authors').run(conn, function(err, cursor) {
        if (err) throw err;
        cursor.toArray(function(err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result, null, 2));
        });
    });

    //close connection
    closeConnection(conn);
});



// r.table('tv_shows').filter(r.row('episodes').gt(100))
// .then(function(data) {
//     console.log(data);
// });