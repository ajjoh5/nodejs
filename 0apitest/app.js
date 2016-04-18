var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/post', function (req, res) {

    console.log('Post received');;

    var reqBack = {
        headers : req.headers,
        body : req.body
    };

    console.log(reqBack);

    res.send(reqBack);
});

app.get('/get', function (req, res) {

    console.log('Get received');;

    var json = {
        name : 'Adam Johnstone',
        address : '34 My Address Rd, My Suburb, 2918'
    };

    console.log(json);

    res.send(json);
});

app.listen(5050, function () {
    console.log('Example app listening on port 5050!');
});