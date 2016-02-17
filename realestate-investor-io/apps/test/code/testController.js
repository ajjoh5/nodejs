var format = require('string-format');
var async = require('async');

var testController = function(app) {

    var request = require("request");
    var cheerio = require("cheerio");
    var url = "http://www.realestate.com.au/buy/in-mortlake%2c+vic+3272%3b/list-{0}?activeSort=price-asc";


    app.get('/test/hello', function(req, res) {
        var viewParams = {
            layout : __dirname + '/../views/layouts/layout',
            viewFile : __dirname + '/../views/hello',
            message : 'NPM World'
        };

        res.render(viewParams.viewFile, viewParams);
    });


    app.get('/test/scrape', function(req, res) {

        var jsonListings = [];
        var maxIteration = 1000;
        var rUrl = '';
        var asyncTasks = [];

        rUrl = format(url, 1);
        request(rUrl, function (error, response, body) {
            if (!error) {

                var $ = cheerio.load(body);
                var listings = $("#searchResultsTbl");

                var resultsInfo = $('div.resultsInfo').text();
                var numResults = resultsInfo.substring(resultsInfo.indexOf(' of ') + 4, resultsInfo.indexOf(' total'));
                var numPages = 1;
                if(numResults) {
                    numPages = (numResults / 20) + 1;
                    numPages = Math.floor(numPages);
                }

                for(var i=1; i <= numPages; i++) {

                    asyncTasks.push(function(callback){
                        var tempUrl = 'http://www.realestate.com.au/buy/in-mortlake%2c+vic+3272%3b/list-' + i;

                        getListingPage(tempUrl, function(jsonListings) {
                            console.log(jsonListings[0]);
                            callback(jsonListings);
                        });
                    });
                }

                async.parallel(asyncTasks, function(){
                    // All tasks are done now
                    console.log('all run!!');
                });

            } else {

            }
        });
    });

    function getListingPage(tUrl, callback) {

        var jsonListings = [];

        request(tUrl, function (error, response, body) {
            if (!error) {

                var $ = cheerio.load(body);
                var listings = $("#searchResultsTbl");

                listings.find('article').each(function(i, element){
                    var a = $(this);
                    var item = getItemDetails(a);
                    jsonListings.push(item);
                });

                console.log("Found the listings: " + tUrl);
                callback(jsonListings);
            } else {
                console.log("We’ve encountered an error: " + error);
                callback(jsonListings);
            }
        });

    };

    function getItemDetails(a) {
        var retval = {};

        var price = a.find('p.priceText').text();
        var address = a.find('div.vcard').text();
        var bed = a.find('dt.rui-icon-bed').next().text();
        var bath = a.find('dt.rui-icon-bath').next().text();
        var car = a.find('dt.rui-icon-car').next().text();

        retval = {
            price : price,
            address : address,
            bed : bed,
            bath : bath,
            car : car
        };

        return retval;
    }
}
module.exports = testController;