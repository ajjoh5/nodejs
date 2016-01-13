var express = require('express');
var app = express();


app.get('/', function(req, res) {
    res.send('This is the website');
});


app.listen(3001, function() {
    console.log('Server running at: 3001');
});