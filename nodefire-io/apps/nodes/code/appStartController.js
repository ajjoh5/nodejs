//Reboot Plugins
var _ = require('underscore');
var Datastore = require('nedb');
var db = {};

var appStartController = function(app) {

    function init() {
        db.users = new Datastore(__dirname + '/../data/users.db');
        db.cars = new Datastore(__dirname + '/../data/cars.db');

        db.users.loadDatabase(function (err) {
            // Callback is optional
            // Now commands will be executed
            console.log('users: db loaded... manually');
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

            db.users.insert(doc);
        });

        db.cars.loadDatabase(function (err) {    // Callback is optional
            // Now commands will be executed
            console.log('cars: db loaded... manually');
        });
    };

    init();
}

module.exports = appStartController;