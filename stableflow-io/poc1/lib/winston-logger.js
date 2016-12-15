var winston = require('winston');
winston.emitErrs = true;

var logger = new winston.Logger({
    transports: [
        // new winston.transports.File({
        //     //level: 'info',
        //     filename: logFileLocation,
        //     handleExceptions: true,
        //     json: true,
        //     maxsize: 5242880, //5MB
        //     maxFiles: 5,
        //     colorize: false
        // })
        // new winston.transports.Console({
        //     level: 'debug',
        //     handleExceptions: true,
        //     json: false,
        //     colorize: true
        // })
    ],
    exitOnError: false
});

var logFileLocation = __base + '/lib/logs/all-logs';
var options = {
    name: 'all-logs',
    filename: logFileLocation,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, //5MB
    maxFiles: 5,
    colorize: false,
    datePattern: '_yyyy-MM-dd.log'
};

logger.add(require('winston-daily-rotate-file'), options);



module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};