var ParticleData = function(options) {

};

ParticleData.prototype.Insert = function(particle) {

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
                assert.equal(null, err, 'Error inserting record into mongodb.');
                db.close();
            });
        });
    }
};

ParticleData.prototype.Find = function(query) {

    var MongoClient = require('mongodb').MongoClient;
    var assert = require('assert');

    // Connection URL
    var url = 'mongodb://192.168.99.100:27017/test';
    // Use connect method to connect to the Server
    MongoClient.connect(url, function(err, db) {

        db.collection('particles').find(query).toArray(function(err, result) {
            //if error, add this to database for processing later - like a queue!!
            assert.equal(null, err, 'Error finding records into mongodb.');
            db.close();
            return result;
        });
    });
};

// ParticleData.prototype.CreateParticle = function(particle) {
//
//
// };


module.exports = ParticleData;