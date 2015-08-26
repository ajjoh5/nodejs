//other plugins
var request = require('request');

function reCacheRunway(brand)
{
    var apiUrl = 'http://webapi.henley.com.au/rc/runway/cache-packages/' + brand;

    var options = {
        url: apiUrl
    };

    request.get(options, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            console.log('SUCCESS: Re-cached runway with brand: "' + brand + '"');
        }
        else {
            console.log('ERROR: Re-cache failed. Error was - ' + body);
        }
    });
}

reCacheRunway('MainVue VIC');
