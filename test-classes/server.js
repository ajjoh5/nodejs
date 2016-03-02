var myClass = require('./index.js');

var m = new myClass();

var logger = new m.Logger();
logger.log();
logger.write('new message');
logger.write('message 2');
logger.log();

console.log(m);

m.saySomething();