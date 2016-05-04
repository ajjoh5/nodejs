var ParticleFirebase = function(options) {

    //init plugins
    var dateFormat = require('dateformat');
    var _ = require('underscore');
    var fs = require('fs-extra');
    var db = require('./FirebaseDB.js').createDB();

    var getUserByKeytoken = function(keytoken, ref, callback) {

        var users = ref.child('users');
        users.once("value", function(data) {

            var allUsers = data.val();

            var user = _.find(allUsers, function(item) {
                return item.keytoken == keytoken
            });

            if(!user) {
                return callback('No user found for keytoken: ' + keytoken, null);
            }

            return callback(null, user);

        }, function (error) {
            return callback(error, null)
        });

    };

    var processHooks = function(newParticle, userid, hooksRef) {

        //hooksRef = userid + '/hooks'
        hooksRef.once("value", function(data) {

            var allHooks = data.val();

            //Go through all hooks, and return the first one that matches __id, __type, __group
            var hook = _.find(allHooks, function(item) {
                // return item.keytoken == keytoken

                //if newParticle contains the field, and that field contains the hook value, run hook
                if(newParticle[item.field] && newParticle[item.field] == item.hookValue) {

                    var requireFile = __base + '/hooks/' + userid + '/' + item.name + '.js';

                    delete require.cache[require.resolve(requireFile)];
                    var hook = require(requireFile).create({ insert : newParticle });

                    hook.execute(function(err, data) {
                        //TODO: Log hook & log errors
                        // console.log(err);
                        // console.log(data);
                    });
                }

            });

        }, function (error) {
            //throw error
        });

    };

    //get a unique particle id
    var getPID = function(name) {
        var retval = (!name) ? '-' : '-' + name;
        var time = (new Date).getTime();
        return retval + time;
    };

    return {

        insertParticle : function(keytoken, particle, callback) {

            var particleTemplate = {
                __id : '',
                __group : 'default',
                __created : '',
                __type : 'info',

                particle : {}
            };

            if(!particle) {
                return callback('particle was null.', null);
            }

            if(!keytoken) {
                return callback('unauthorised.', null);
            }

            //Setup particle from particle template
            var newParticle = particleTemplate;

            //If not overriden, use current UTC system date/time
            newParticle.__created = (!particle.__created) ? dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT') : particle.__created;

            //Setup all default values of new particle from template
            newParticle.__group = (!particle.__group) ? particleTemplate.__group : particle.__group;
            newParticle.__type = (!particle.__type) ? particleTemplate.__type : particle.__type;
            newParticle.__id = (!particle.__id) ? particleTemplate.__id : particle.__id;
            newParticle.particle = particle;

            //Delete any override fields from posted particle object
            //because we want clean particle (only data of particle, not override fields contained within db save)
            delete newParticle.particle.__created;
            delete newParticle.particle.__group;
            delete newParticle.particle.__type;
            delete newParticle.particle.__id;

            db.init(function(err, ref) {

                //TODO: Make the get user by keytoken < 10ms (without this 10 x runs in 3.5 secs, with it 10 x runs in 7 secs)
                //Ensure user keytoken is valid
                getUserByKeytoken(keytoken, ref, function(err, user) {

                    if(err) {
                        return callback(err, null);
                    }

                    var particles = ref.child(user.userid + '/particles');

                    particles.push(newParticle, function(error) {
                        if(!error) {
                            //Process hooks
                            processHooks(newParticle, user.userid, ref.child(user.userid + '/hooks'));

                            return callback(null, newParticle);
                        }
                        else {
                            return callback(error, null);
                        }
                    });
                });
            });

        },

        getParticlesByGroup : function(keytoken, group, callback) {

            if(!keytoken) {
                return callback('Unauthorised.', null);
            }

            db.init(function(err, ref) {

                //TODO: Make the get user by keytoken < 10ms (without this 10 x runs in 3.5 secs, with it 10 x runs in 7 secs)
                //Ensure user keytoken is valid
                getUserByKeytoken(keytoken, ref, function(err, user) {

                    if(err) {
                        return callback(err, null);
                    }

                    var particles = ref.child(user.userid + '/particles');

                    particles.once("value", function(data) {

                        var groupParticles = [];

                        //if group exists and is not null, then filter down
                        //otherwise, get all particles
                        if(group) {
                            groupParticles = _.filter(data.val(), function(item) {
                                return item.group === group
                            });
                        }
                        else {
                            groupParticles = _.filter(data.val(), function(item) {
                                return item != null
                            });
                        }

                        return callback(null, groupParticles);

                    }, function (error) {
                        return callback(error, null);
                    });
                });
            });

        },


        insertHook : function(keytoken, hook, callback) {

            if(!hook) {
                return callback('hook was null.', null);
            }

            if(!hook.file) {
                return callback('hook file contents was null.', null);
            }

            if(!keytoken) {
                return callback('unauthorised.', null);
            }

            var hookTemplate = {
                __created : '',
                name : '',
                field : '__type',
                hookValue : 'error'
            };
            
            //Setup particle from particle template
            var newHook = hookTemplate;
            var hookID = (!hook.id) ? getPID('hook-') : hook.id;

            //If not overriden, use current UTC system date/time
            //don't include "file" either, not saving this to database
            newHook.__created = dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT');
            newHook.name = hook.name;
            newHook.field = hook.field;
            newHook.hookValue = hook.hookValue;

            db.init(function(err, ref) {

                //TODO: Make the get user by keytoken < 10ms (without this 10 x runs in 3.5 secs, with it 10 x runs in 7 secs)
                //Ensure user keytoken is valid
                getUserByKeytoken(keytoken, ref, function(err, user) {

                    if(err) {
                        return callback(err, null);
                    }

                    //Get path to file in user "hooks" directory
                    var hookFile = __base + '/hooks/' + user.userid + '/' + newHook.name + '.js';
                    var hookTemplateFile = __base + '/hooks/hookTemplate.js';

                    //push hook into database, then create hook file
                    var hooks = ref.child(user.userid + '/hooks/' + hookID);

                    hooks.set(newHook, function(error) {
                        if(!error) {

                            //write hook file, using hook template file, then put in the javascript
                            fs.readFile(hookTemplateFile, 'utf8', function (err, data) {
                                var hookFileContents = data;

                                //remove an harmful requires (no nasty injections)
                                hook.file = hook.file.replace('require', 'unrequire');

                                //inject javascript into template
                                hookFileContents = hookFileContents.replace('[jsFile]', hook.file);

                                fs.outputFile(hookFile, hookFileContents, function (err) {
                                    //console.log(err);
                                });
                            });
                            return callback(null, newHook);
                        }
                        else {
                            return callback(error, null);
                        }
                    });
                });
            });

        }

    }
};

module.exports.createDB = function(options) {
    return new ParticleFirebase(options);
};