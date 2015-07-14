var hotswap = require('hotswap');
var test = require('./js/test');

hotswap.on('swap', function() {
    // we are going to console.log(test) whenever it's changed
    console.log('Swapped: ' + test.version);
});