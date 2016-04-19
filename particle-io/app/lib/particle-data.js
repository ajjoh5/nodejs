var ParticleData = function(options, particle) {
    var Datastore = require('nedb');
    var format = require('string-format');

    //Init neDB JSON storage
    var db = {};
    db.particles = new Datastore({ filename: format('{0}/data/{1}.db', __base, options.group), autoload: true });

    if (particle) {
        db.particles.insert(particle, function (err, newDoc) {
            if(err) {
                //error handling
            }
            else {
                //successful
            }
        });
    }
};

// ParticleData.prototype.CreateParticle = function(particle) {
//
//
// };


module.exports = ParticleData;