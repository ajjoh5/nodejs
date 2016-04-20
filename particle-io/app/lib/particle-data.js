var ParticleData = function(options, particle) {

    // var Datastore = require('nedb');
    // var format = require('string-format');
    //
    // //Init neDB JSON storage
    // var db = {};
    // db.particles = new Datastore({ filename: format('{0}/data/{1}.db', __base, options.group), autoload: true });
    //
    // if (particle) {
    //     db.particles.insert(particle, function (err, newDoc) {
    //         if(err) {
    //             //error handling
    //         }
    //         else {
    //             //successful
    //         }
    //     });
    // }

    if(particle) {
        var MongoClient = require('mongodb').MongoClient;
        var assert = require('assert');

        // Connection URL
        var url = 'mongodb://192.168.99.100:27017/test';
        // Use connect method to connect to the Server
        MongoClient.connect(url, function(err, db) {

            db.collection('particles').insert(particle, function(err, result) {
                console.log(result);
                //if error, add this to database for processing later - like a queue!!
                assert.equal(1, err, 'Error inserting record into mongodb.');
                db.close();
            });
        });
    }
};

// ParticleData.prototype.CreateParticle = function(particle) {
//
//
// };


module.exports = ParticleData;