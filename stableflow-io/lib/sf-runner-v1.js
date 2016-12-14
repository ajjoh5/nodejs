var SFRunner = function(options) {

    var _ = require('underscore');

    //File based winston logging
    var logger = require('../lib/winston-logger.js');

    //init vars and defaults
    var timeout = 5000;

    function SendEmail(options, callback) {
        console.log(options.to);
        var message = 'Email sent to: ' + options.to;
        return callback(null, message);
    }

    function CreateTask(options, callback) {
        var message = 'Task created and assigned to: ' + options.assigned;
        return callback(null, message);
    }

    return {

        QueueCommand : function(commandName, options, callback) {

            var message = "Error - Command not recognised.";

            switch(commandName.toLowerCase()) {
                case 'send-email':
                    message = SendEmail(options);
                    break;
                case 'create-task':
                    message = CreateTask(options);
                    break;
                default:

            }

            return callback(null, message);
        }
    }
};

module.exports.create = function(options) {
    return new SFRunner(options);
};