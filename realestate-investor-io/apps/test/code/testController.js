var format = require('string-format');
var async = require('async');

var testController = function(app) {

    var request = require("request");
    var cheerio = require("cheerio");
    var url = "http://www.realestate.com.au/buy/in-essendon%2c+vic+3040%3b+/list-{0}?activeSort=price-asc";


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

                var promises = [];
                createAsyncListingRequests(numPages, promises);

                //Once all web requests run, combine them all together
                async.parallel(promises, function (err, results) {

                    var combinedResults = [];

                    for(var r in results) {
                        combinedResults.push.apply(combinedResults, results[r]);
                    }

                    res.send(combinedResults);
                });

            }
            else {

            }
        });
    });

    function createAsyncListingRequests(numPages, promises) {

        for(var i = 1; i <= numPages; i++) {

            (function(b) {
                var newUrl = format(url, b);

                promises.push(function(callback) {

                    //Async the get listings for the URL + page number
                    getListingPage(newUrl, callback);
                });

            })(i);
        }
    }

    function getListingPage(tUrl, callback) {

        var jsonListings = [];

        request(tUrl, function (error, response, body) {
            if (!error) {

                var $ = cheerio.load(body);
                var listings = $("#searchResultsTbl");

                listings.find('article').each(function(i, element){
                    var a = $(this);
                    var item = getItemDetails(a);

                    //filter out bad results
                    if(item.bed && item.bath && item.price && item.address) {
                        jsonListings.push(item);
                    }
                    else {
                        console.log(format('Dropped: {0} - {1} - {2} - {3}', item.address, item.bed, item.bath, item.price))
                    }

                    //Get all listings (debug only)
                    //jsonListings.push(item);
                });

                console.log("Found the listings: " + tUrl);
                callback(null, jsonListings);
            } else {
                console.log("We’ve encountered an error: " + error);
                callback(error, null);
            }
        });

    };

    function convertShorthandNumbers(num) {

        //remove commas
        num = num.replace(/,/g, '');

        if(num.indexOf('K') > -1) {
            console.log(format('Cleaning up thousand (K): {0}' + num));
            num = num.replace(/K/g, '000');

            return num;
        }

        if(num.indexOf('M') > -1) {
            console.log(format('Cleaning up million (M): {0}' + num));
            var m1 = num.indexOf('M');
            var m2 = num.indexOf('.');

            var numOfZeros = 6;

            if(m2 > -1) {
                m2++;
                numOfZeros = numOfZeros - (m1 - m2);
            }

            var millString = '';
            for(var i = 1; i <= numOfZeros; i++) {
                millString += '0';
            }

            num = num.replace(/M/g, millString);

            //remove dot point
            num = num.replace(/\./g, '');
            return num;
        }

        return num;
    }

    function getItemDetails(a) {
        var retval = {};

        var price = a.find('p.priceText').text();
        //ensure all characters are uppercase
        price = price.toUpperCase();

        if(price.indexOf('$') > -1) {

            //Get a clean version of price
            price = price.substring(price.indexOf('$') + 1);
            price = price.replace(/-/, ' ');

            //Convert any Millions (M) or thousands (K) to the proper number
            price = convertShorthandNumbers(price);

            //Get rid of any text or numbers after a trailing space
            if(price.indexOf(' ') > -1) {
                price = price.substring(0, price.indexOf(' '));
            }

            if(price.length < 4) {
                price = null;
            }
        }
        else
        { price = null; }

        var address = a.find('div.vcard').text();
        var bed = a.find('dt.rui-icon-bed').next().text();
        var bath = a.find('dt.rui-icon-bath').next().text();
        var car = a.find('dt.rui-icon-car').next().text();

        //validation on returned items


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