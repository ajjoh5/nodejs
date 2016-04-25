// var db = require('./lib/FirebaseDB.js').createDB();
//
// db.init(function(err, ref) {
//
//     ref.once("value", function(data) {
//         console.log(data.val());
//     });
//
// });


var db = require('./lib/particle-firebase.js').createDB();

var particle = {
    'lead' : {
        'first-name' : 'adam',
        'last--name' : 'johnstone'
    }
};

var keytoken = 'ff1bc4174529248c949e04d601fecc2f7c7dde5a32367ebff5f559b0fcf2615a';

db.insertParticle(keytoken, particle, function(err, data) {
    console.log(err);
    console.log(data);
});