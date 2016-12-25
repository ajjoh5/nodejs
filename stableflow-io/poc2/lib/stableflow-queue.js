var StableflowQueue = function(options, ready) {

    //Bluebird promises
    var Promise = require('bluebird');

    //Timestamp utils
    var timestamp = require('time-stamp');

    //Once stableflow db is setup, emit event ready!
    var events = require('events');
    var eventEmitter = new events.EventEmitter();
    eventEmitter.on('dbReady', ready);

    var config = {
        host: 'localhost',
        port: 28015,
        db: 'Stableflow',
        workflowTable: 'Q_Workflow'
    };

    //Create RethinkDB handle
    var rethinkDB = require('../lib/RethinkDB').create({
        host: config.host,
        port: config.port,
        db: config.db
    });

    var isInit = false;


    //Get the DB, then run setup
    rethinkDB.getDB(function(err, conn, r) {

        r.table(config.workflowTable).indexWait('createdAt').run(conn).then(function(err, result) {
            console.log("Table and index are available, starting StableFlow...");

            isInit = true;  //init complete, start program
            eventEmitter.emit('dbReady');

            conn.close();
        }).error(function(err) {

            // The database/table/index was not available, create them
            r.dbCreate(config.db).run(conn).finally(function() {
                return r.tableCreate(config.workflowTable).run(conn)
            }).finally(function() {
                return r.table(config.workflowTable).indexCreate('createdAt').run(conn);
            }).finally(function(result) {
                return r.table(config.workflowTable).indexWait('createdAt').run(conn)
            }).catch(function(err) {
                console.log('err');
            }).finally(function(result) {
                console.log("Table and index are available, starting Stableflow...");
                //console.log(result);
                isInit = true;  //init complete, start program
                eventEmitter.emit('dbReady');

                conn.close();
            }).error(function(err) {
                if (err) {
                    console.log("Could not wait for the completion of the index on '" + config.workflowTable + "'");
                    console.log(err);
                    process.exit(1);
                }
                console.log("Table and index are available, starting Stableflow...");
                isInit = true;  //init complete, start program

                conn.close();
            });
        });

    });

    return {

        countQ: function() {

            return new Promise(function(resolve, reject) {

                rethinkDB.getDB(function(err, conn, r) {
                    r.table(config.workflowTable).count().run(conn)
                    .error(function(err) { reject(err); })
                    .then(function(result) { resolve(result); });
                    });
            });
        },

        listQ: function() {

            return new Promise(function(resolve, reject) {

                rethinkDB.getDB(function(err, conn, r) {
                    r.table(config.workflowTable).run(conn)
                    .error(function(err) { reject(err); })
                    .then(function(cursor) {
                        if (err) throw err;
                        cursor.toArray(function(err, result) {
                            if (err) throw err;
                            //resolve(JSON.stringify(result, null, 2));
                            resolve(result);
                        });
                    });
                });

            });
        },

        listQByStatus: function(status) {

            return new Promise(function(resolve, reject) {

                rethinkDB.getDB(function(err, conn, r) {
                    r.table(config.workflowTable).filter( {_properties : { status: status }} ).run(conn)
                    .error(function(err) { reject(err); })
                    .then(function(cursor) {
                        if (err) throw err;
                        cursor.toArray(function(err, result) {
                            if (err) throw err;
                            //resolve(JSON.stringify(result, null, 2));
                            resolve(result);
                        });
                    });
                });

            });
        },


        addQ: function(wf) {

            return new Promise(function(resolve, reject) {

                rethinkDB.getDB(function(err, conn, r){

                    // wf properties setup
                    wf._properties = {
                        dateAdded : timestamp('YYYY-MM-DD HH:mm:ss'),
                        status : 'add',
                        wfState: '',
                    };

                    //insert workflow into table
                    r.table(config.workflowTable).insert(wf).run(conn)
                    .error(function(err) { reject(err); })
                    .then(function(result) { resolve(result); })
                });

            });

        },

        updateQ: function(wf) {

            return new Promise(function(resolve, reject) {

                console.log('updating q');

                rethinkDB.getDB(function(err, conn, r){

                    // wf properties setup
                    wf._properties.dateUpdated = timestamp('YYYY-MM-DD HH:mm:ss');

                    //insert workflow into table
                    r.table(config.workflowTable).get(wf.id).update(wf).run(conn)
                    .error(function(err) { reject(err); })
                    .then(function(result) { resolve(result); })
                });

            });

        },

        updateQProperties: function(wfID, wfProperties) {

            return new Promise(function(resolve, reject) {

                rethinkDB.getDB(function(err, conn, r){

                    // wf properties setup
                    wfProperties.dateUpdated = timestamp('YYYY-MM-DD HH:mm:ss');

                    //insert workflow into table
                    r.table(config.workflowTable).get(wfID).update({ _properties : wfProperties}).run(conn)
                    .error(function(err) { reject(err); })
                    .then(function(result) { resolve(result); })
                });

            });

        },

        runWorkflowState: function(wf) {

            return new Promise(function(resolve, reject) {

                rethinkDB.getDB(function(err, conn, r){

                    console.log('Running wf.State: ' + wf._properties.wfState + " >> " + wf._properties.wfStateCommand);

                    // if(!wf.states[state]._properties) {
                    //     //init state properties
                    //     wf.states[state]._properties = { dateRun : '', status: '', completed : false };
                    // }
                    //
                    // wf.states[state]._properties.status = 'in progress';
                    // wf.states[state]._properties.completed = false;

                    var cType = wf._properties.wfStateCommand.split('|')[1];

                    var command = wf.states[wf._properties.wfState][wf._properties.wfStateCommand];
                    command._q = {
                        status : 'in progress'
                    };
                    //console.log(command);

                    //run command
                    switch(cType.toLowerCase()) {

                        case 'send-email':
                            //console.log('Sending email through gmail...');
                            var nodemailer = require('nodemailer');
                            var transporter = nodemailer.createTransport('smtps://ajjoh5@gmail.com:onemillionin2016@smtp.gmail.com');
                            var mailOptions = {
                                from: command.from, // sender address
                                to: command.to, // list of receivers
                                subject: command.subject, // Subject line
                                text: command.bodyText, // plaintext body
                                html: command.bodyHtml // html body
                            };

                            transporter.sendMail(mailOptions, function(error, info){
                                if(error){
                                    //return console.log(error);
                                }

                                //If mail sent success, update command to 'completed'
                                console.log('Message sent: ' + info.response);
                                command._q = {
                                    status : 'completed'
                                };
                                console.log(command._q);
                            });

                            break;

                        default:

                            break;

                    }

                });

            });

        },

        clearQ: function() {

            return new Promise(function(resolve, reject) {

                rethinkDB.getDB(function(err, conn, r){

                    //insert workflow into table
                    r.table(config.workflowTable).delete().run(conn)
                    .error(function(err) { reject(err); })
                    .then(function(result) { resolve(result); })
                });

            });

        }

    }

};

module.exports.create = function(options, ready) {
    return new StableflowQueue(options, ready);
};