var StableFlow = function(options) {

    var fs = require('fs');
    var _ = require('underscore');

    //File based winston logging
    var logger = require('../lib/winston-logger.js');

    function getWorkflowByID(wfID) {
        var allWorkflows = JSON.parse(fs.readFileSync(__base + "/workflows/workflows.json", 'utf8'));
        var wf = _.find(allWorkflows, function(item) { return item.id == wfID; });

        return wf;
    }

    function QueueCommand(command, options, callback) {


        return callback(null, 'Done!');
    }

    return {

        getAllWorkflows : function(callback) {

            //read json workflows
            var allWorkflows = JSON.parse(fs.readFileSync(__base + "/workflows/workflows.json", 'utf8'));
            return callback(null, allWorkflows);
        },

        getWorkflowByID: function(wfID, callback) {
            return callback(null, getWorkflowByID(wfID));
        },

        startWorkflow: function(wfID, callback) {

            var wf = getWorkflowByID(wfID);

            //find all the wf states in order
            var states = _.keys(wf.states);

            //start state 0 (first in the list)
            //get all commands in this state 0
            var wfCommands = wf.states[states[0]];
            var wfCommandList = _.keys(wfCommands);
            _.each(wfCommandList, function(item) {
                //console.log(item);
                //console.log(wfCommands[item]);

                QueueCommand(item, wfCommands[item], function(err, data) {
                    console.log(data);
                });

            });

            return callback(null, 'All commands queued.');
        }
    }
};

module.exports.create = function(options) {
    return new StableFlow(options);
};