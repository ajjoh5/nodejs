var path = require('path');
var _ = require('underscore');
const inquirer = require('inquirer-question');

//Create global var __base for root path
global.__base = path.dirname(require.main.filename) + '/';

//Create stable flow
var stableflow = require('./lib/stableflow').create({});


function MainMenu() {
    inquirer.prompt({
        type: 'list',
        message: 'Stableflow.io - Workflows Menu',
        choices: { '1. Workflows': 1, '2. Exit': 0 }
    }).then(function(result) {
        if(result == 1) {
            WorkflowList();
        }
    });
}

function WorkflowList() {

    var choiceOptions = {};

    stableflow.getAllWorkflows(function(err, data) {
        _.each(data, function(item) {
            choiceOptions[item.name] = function() { return item; };
        });
    });

    //Add back option
    choiceOptions['<< Back'] = function() { return 0; };

    inquirer.prompt({
        type: 'list',
        message: '1. Workflows',
        choices: choiceOptions
    }).then(function(result) {
        if(result == 0) { MainMenu(); }
        else {
            WorkflowMenu(result);
        }
    });
}
function WorkflowMenu(workflow) {

    var choiceOptions = {};

    inquirer.prompt({
        type: 'list',
        message: workflow.name,
        choices: { '1. Start Workflow': 1, '2. See Instances Running': 2, '<< Back': 0 }
    }).then(function(result) {
        if(result == 0) { WorkflowList(); }
        else if (result == 1) {
            RunWorkflow(workflow);
        }
        else if (result == 2) {
            console.log('Instances menu coming...');
        }
        else {
            return result;
        }
    });
}

function RunWorkflow(workflow) {

    console.log('- Running workflow: ' + workflow.name + " ...");

    stableflow.startWorkflow(workflow.id, function(err, data) {
        console.log("- " + data);
    });

    WorkflowMenu(workflow);
}


MainMenu();
