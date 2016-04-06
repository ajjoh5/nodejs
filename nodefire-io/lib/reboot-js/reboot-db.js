var Datastore = require('nedb');
var db = {};

function initDB(dbName, dbLocation) {
    db[dbName] = new Datastore(dbLocation);
    db[dbName].loadDatabase(function (err) {
        console.log('db loaded: ' + dbName);
    });
};

function find(dbName, query) {
    db[dbName].find(query, function (err, docs) {
        console.log(docs);
        return docs;
    });
};

function insert(dbName, doc) {
    db[dbName].insert(doc);
};

function getDB() {
    return db;
};

//db.users = new Datastore(__base + 'db/users.db');
//db.cars = new Datastore(__base + 'db/cars.db');
//
//db.users.loadDatabase(function (err) {    // Callback is optional
//    // Now commands will be executed
//    console.log('users: db loaded... manually');
//});
//
//db.cars.loadDatabase(function (err) {    // Callback is optional
//    // Now commands will be executed
//    console.log('cars: db loaded... manually');
//
//    var doc = {
//        hello: 'world',
//        n: 5,
//        today: new Date(),
//        nedbIsAwesome: true,
//        notthere: null,
//        notToBeSaved: undefined,  // Will not be saved
//        fruits: [ 'apple', 'orange', 'pear' ],
//        infos: { name: 'nedb' }
//    };
//
//    var doc2 = {
//        hello: 'wassup',
//        n: 7,
//        today: new Date(),
//        nedbIsAwesome: true,
//        notthere: null,
//        notToBeSaved: undefined,  // Will not be saved
//        fruits: [ 'apple', 'orange', 'pear' ],
//        infos: { name: 'nedb2' }
//    };
//
//    db.cars.insert(doc);
//    db.cars.insert(doc2);
//
//});

module.exports.initDB = initDB;
module.exports.find = find;
module.exports.insert = insert;
module.exports.getDB = getDB;
