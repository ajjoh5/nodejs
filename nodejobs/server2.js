var request = require('request');

//var url = 'https://henley.runway.com.au/api-docs/';
var j = request.jar();
var cookie = request.cookie('JSESSIONID=4B2565E0999F804B5253DCED3BF4454C');
//j.setCookie(cookie, url);

//var options = {
//    url: url,
//    jar: j
//};
//
//request.get(options, function (error, response, body) {
//    if (!error && response.statusCode == 200) {
//        console.log('success...');
//        console.log(response.statusCode);
//        console.log(body);
//    }
//    else
//    {
//        console.log('error...');
//        console.log(error);
//        console.log(response.statusCode);
//        console.log(body);
//    }
//});

var url2 = 'https://henley.runway.com.au/api/2/packages?ModifiedSince=01/01/2015';
j.setCookie(cookie, url2);

var options2 = {
    url: 'https://henley.runway.com.au/api/2/packages?ModifiedSince=01/01/2015',
    jar: j
};

console.log(options2);
console.log('Sending Request: ' + options2.url);

request.get(options2, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log('success...');
        console.log(response.statusCode);
        console.log(body);
    }
    else
    {
        console.log('error...');
        console.log(error);
        console.log(response.statusCode);
        console.log(body);
    }
});


//request.post(options, function (error, response, body) {
//    if (!error && response.statusCode == 200) {
//        console.log('success...');
//        console.log(response.statusCode);
//        console.log(body);
//    }
//    else {
//        console.log('error...');
//        console.log(error);
//        console.log(response.statusCode);
//        console.log(response.headers.location);
//        console.log(body);
//    }
//});