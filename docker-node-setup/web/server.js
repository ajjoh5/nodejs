var express = require('express');
var Datastore = require('nedb');
var db = {};

var app = express();

app.get('/', function (req, res) {
    res.send('Hello World - v1.6!');

    db.users = new Datastore('db/users.db');
    db.cars = new Datastore('db/cars.db');

    db.users.loadDatabase(function (err) {    // Callback is optional
        // Now commands will be executed
        console.log('users: db loaded... manually');
    });

    db.cars.loadDatabase(function (err) {    // Callback is optional
        // Now commands will be executed
        console.log('cars: db loaded... manually');

        var doc = {
            hello: 'world',
            n: 5,
            today: new Date(),
            nedbIsAwesome: true,
            notthere: null,
            notToBeSaved: undefined,  // Will not be saved
            fruits: [ 'apple', 'orange', 'pear' ],
            infos: { name: 'nedb' }
        };

        var doc2 = {
            hello: 'wassup',
            n: 7,
            today: new Date(),
            nedbIsAwesome: true,
            notthere: null,
            notToBeSaved: undefined,  // Will not be saved
            fruits: [ 'apple', 'orange', 'pear' ],
            infos: { name: 'nedb2' }
        };

        db.cars.insert(doc);
        db.cars.insert(doc2);

    });
});

app.get('/docs', function (req, res) {
    db.cars.find({ "infos.name": 'nedb' }, function (err, docs) {
        // docs contains Earth
        console.log(docs);
    });

    db.cars.find({}, function (err, docs) {
        // docs contains Earth
        console.log(docs);
    });

    res.send('Found docs');
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});