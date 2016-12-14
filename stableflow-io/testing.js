var schedule = require('node-schedule');
var fs = require('fs');
var _ = require('underscore');
const inquirer = require('inquirer-question');

function displayTime() {
    var timeNow = new Date();
    console.log(timeNow);
}

//read json workflows
var workflows = JSON.parse(fs.readFileSync(__dirname + "/workflows/workflow_01.json", 'utf8'));

var states = _.keys(workflows[0].states);
_.each(states, function(item) {
    //console.log(item);
});

// var j = schedule.scheduleJob('0-59 * * * *', function(){
//     console.log('job ran: 1 minute');
//     displayTime();
// });


function MainMenu() {
    inquirer.prompt({
        type: 'list',
        message: 'Stableflow.io - Workflows Menu',
        choices: {
            '1. Workflows': 1,
            '2. Exit': 2
        }
    }).then(function(result) {
        if(result == 1) {
            WorkflowsMenu();
        }
    });
}

function WorkflowsMenu() {

    var choiceOptions = {};

    _.each(workflows, function(item) {
        choiceOptions[item.name] = function() { return item; };
    });

    inquirer.prompt({
        type: 'list',
        message: '1. Workflows',
        choices: choiceOptions
    }).then(function(result) {
        console.log(result);
    });
}

MainMenu();