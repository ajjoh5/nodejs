//init variables
var assert = require('assert');

//Add in Classes / Controllers
var db = require('../lib/particle-firebase.js').createDB();

describe('test-particle-app', function(){

    it ('check that 1+1 = 2', function() {
        assert.equal((1+1), 2);
    });

    it ('Check if can insert particle (check db auth, keytoken auth, etc)', function() {

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

            assert.equal(1,2);
            assert.equal(err, null, 'Error returned on insert particle. Error was - ' + err);
        });

    });

});