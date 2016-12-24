//Init vars
var path = require('path');
var _ = require('underscore');

//Create global var __base for root path
global.__base = path.dirname(require.main.filename) + '/';

//Create RethinkDB handle
var sfQueue = require('./lib/stableflow-queue').create({}, function() {

    //--[ Process all 'added' workflows ]--

    sfQueue.listQByStatus('add')
    .then(function(data) {

        _.each(data, function(wf) {

            //process each workflow
            console.log('Running wf: ' + wf.name);
            var wfStates = _.keys(wf.states);

            _.each(wfStates, function(field) {

                console.log(field);

                var stateCommands =_.keys(wf.states[field]);
                _.each(stateCommands, function(c) {
                    //process each command
                    var command = wf.states[field][c];

                    console.log(c);
                    console.log(command);
                });

            });
        });

    });
});