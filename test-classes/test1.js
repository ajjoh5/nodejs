var options = {
    particle : {
        __type : 'error'
    }
};

var t = require('./test/template.js').create(options);

t.execute(function(err, data) {
    console.log('..end');
});