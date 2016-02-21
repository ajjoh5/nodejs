var format = require('string-format');

//Include rea JS tools
var reajs = require(__base + '/lib/rea-tools-js');

var testController = function(app) {

    //var request = require("request");
    //var cheerio = require("cheerio");
    ////var url = "http://www.realestate.com.au/buy/in-essendon%2c+vic+3040%3b+/list-{0}?activeSort=price-asc";
    //var url = 'http://www.realestate.com.au/buy/in-box+hill%2c+vic+3128/list-{0}?includeSurrounding=false&persistIncludeSurrounding=true&source=location-search';


    app.get('/test/hello', function(req, res) {
        var viewParams = {
            layout : __dirname + '/../views/layouts/layout',
            viewFile : __dirname + '/../views/hello',
            message : 'NPM World'
        };

        res.render(viewParams.viewFile, viewParams);
    });

    app.get('/test/scrape', function(req, res) {

        var suburb = {
            'name' : 'Kensington',
            'postCode' : '3031',
            'state' : 'Vic',
            'reaCode' : 'kensington%2c+vic+3031'
        };

        reajs.scrape.reaSuburbScrape(suburb)
        .then(function (data) {
            console.log('[ REFACTOR LISTINGS ]');
            reajs.refactor.reaRefactorListings(data);

            res.send(data);
        }, function (error) {
            console.log('ERRRRRR: ' + error);
            // All of the promises were rejected.
        });
    });


}

module.exports = testController;