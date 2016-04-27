// var db = require('./lib/FirebaseDB.js').createDB();
//
// db.init(function(err, ref) {
//
//     ref.once("value", function(data) {
//         console.log(data.val());
//     });
//
// });


// var db = require('./lib/particle-firebase.js').createDB();
//
// var particle = {
//     'lead' : {
//         'first-name' : 'adam',
//         'last--name' : 'johnstone'
//     }
// };
//
// var keytoken = 'ff1bc4174529248c949e04d601fecc2f7c7dde5a32367ebff5f559b0fcf2615a';
//
// db.insertParticle(keytoken, particle, function(err, data) {
//     console.log(err);
//     console.log(data);
// });

//var db = require('./lib/particle-firebase.js').createDB();
var request = require('request')

function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    callback();
}

for(var i=0; i < 100; i++) {

    var keytoken = 'ff1bc4174529248c949e04d601fecc2f7c7dde5a32367ebff5f559b0fcf2615a';

    var particle = {
        "type": "info",
        "group": "red leader",
        "data": {
            "cartype": "gokart",
            "cylinders": "1"
        },
        "name": "big daddy"
    };
    
    // Configure the request
    var options = {
        url: 'http://162.243.104.143/api/particles/new',
        method: 'POST',
        json : true,
        body : particle,
        headers : {
            'authorization' : 'Bearer ' + keytoken
        }
    };

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
        else {
            console.log('error: ' + body);
        }
    });
}

console.log('Finished');