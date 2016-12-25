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

        //Process all workflows in status 'add'
        _.each(data, function(wf) {

            //process first state in workflow
            console.log('Running wf: ' + wf.name);
            var wfStates = _.keys(wf.states);

            //set the state to the first (at position 0)
            //set the command to the first (at position 0, in the state at position 0)
            wf._properties.wfState = wfStates[0];
            wf._properties.status = "add";  //TODO: change this to 'init'

            var stateCommands = wf.states[wf._properties.wfState];
            var commandList = _.keys(wf.states[wf._properties.wfState]);

            wf._properties.wfStateCommand = commandList[0];

            //Update the queue with the new wf properties
            sfQueue.updateQProperties(wf.id, wf._properties)
            .then(function(data) {

                sfQueue.runWorkflowState(wf)
                .then(function(data) {

                });
                
            });
            

            // _.each(wfStates, function(field) {
            //
            //     console.log(field);
            //
            //     var stateCommands =_.keys(wf.states[field]);
            //     _.each(stateCommands, function(c) {
            //         //process each command
            //         var command = wf.states[field][c];
            //
            //         console.log('- ' + c);
            //         console.log(command);
            //     });
            //
            // });
        });

    });
});