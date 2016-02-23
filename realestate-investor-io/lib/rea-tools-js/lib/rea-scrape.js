var format = require('string-format');
var async = require('async');
var _ = require('underscore');
var request = require("request");
var cheerio = require("cheerio");
var Q = require('q');


//var suburb = {
//'name' : 'Box Hill',
//    'postCode' : '3128',
//    'state' : 'Vic',
//    'reaCode' : 'box+hill%2c+vic+3128'
//};

function getRandomNum(min, max) {
    return Math.random() * (max - min) + min;
}

function reaGetSuburbStats(suburb) {
    var deferred = Q.defer();

    var statsUrl = 'http://investor-api.realestate.com.au/states/{0}/suburbs/{1}/postcodes/{2}.json';
    var sUrl = format(statsUrl, suburb.state, suburb.name, suburb.postCode);

    request(sUrl, function (error, response, body) {

        if (!error) {
            try {
                var data = JSON.parse(body);
                var suburbData = {
                    houses : [],
                    units : []
                };

                suburbData.houses = data[format('{0}-{1}', suburb.name.toUpperCase(), suburb.postCode)]['property_types']['HOUSE']['bedrooms'];
                suburbData.units = data[format('{0}-{1}', suburb.name.toUpperCase(), suburb.postCode)]['property_types']['UNIT']['bedrooms'];
            }
            catch(error) {
                console.log(format('Error: {0}', error));
            }

            deferred.resolve(suburbData);
        }
        else {
            deferred.reject(new Error(error));
        }
    });

    return deferred.promise;
}

var reaSuburbScrape = function(suburb) {

    var deferred = Q.defer();

    var jsonListings = [];
    var maxIteration = 1000;
    var rUrl = '', sUrl = '';
    var asyncTasks = [];

    var url = 'http://www.realestate.com.au/buy/in-{0}/list-{1}?includeSurrounding=false&persistIncludeSurrounding=true&source=location-search';
    rUrl = format(url, suburb.reaCode, 1);

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
            createAsyncListingRequests(url, suburb.reaCode, numPages, promises);

            //Once all web requests run, combine them all together
            async.parallel(promises, function (err, results) {

                var combinedResults = [];

                for(var r in results) {
                    combinedResults.push.apply(combinedResults, results[r]);
                }

                //set suburb summary to suburb object passed in - then add additional fields
                var suburbSummary = suburb;
                suburbSummary.summary = {};
                suburbSummary.listings = combinedResults;

                deferred.resolve(suburbSummary);
            });

        }
        else {
            deferred.reject(new Error(error));
        }
    });

    return deferred.promise;

};

//Private methods
function createAsyncListingRequests(url, suburb, numPages, promises) {

    for(var i = 1; i <= numPages; i++) {

        (function(b) {
            var newUrl = format(url, suburb, b);

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
            console.log(format("[ SCRAPE - URL: {0} ]",tUrl));

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
                    console.log(format('  > Dropped: {0} - {1} - {2} - {3}', item.address, item.bed, item.bath, item.price))
                }

                //Get all listings (debug only)
                //jsonListings.push(item);
            });

            //callback with all listings
            callback(null, jsonListings);

        } else {
            console.log("We’ve encountered an error: " + error);
            callback(error, null);
        }
    });

}

function cleanNumber(num) {

    //Get a clean version of price
    num = num.substring(num.indexOf('$') + 1);
    num = num.replace(/-/, ' ');
    num = num.replace(/~/, ' ');
    num = num.replace(/\+/, ' ');

    return num;
}

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

function getPropertyType(link) {
    var retval = 'unknown';

    if(link.indexOf('property-') > -1) {
        link = link.substring(link.indexOf('property-') + 9);
        link = link.substring(0, link.indexOf('-'));

        retval = link;
    }

    return retval;
}

function getItemDetails(a) {
    var retval = {};

    var price = a.find('p.priceText').text();
    //ensure all characters are uppercase
    price = price.toUpperCase();

    if(price.indexOf('$') > -1) {

        //Cleanup the price - Clean any text and formatting on the number
        price = cleanNumber(price);

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
    var link = 'http://www.realestate.com.au' + a.find('div.vcard').find('a').attr('href');
    var bed = a.find('dt.rui-icon-bed').next().text();
    var bath = a.find('dt.rui-icon-bath').next().text();
    var car = a.find('dt.rui-icon-car').next().text();
    var imageSrc = a.find('div.media img').attr('src');
    imageSrc = !imageSrc ? a.find('div.photoviewer img').attr('src') : imageSrc;
    imageSrc = (!imageSrc) ? '' : imageSrc;

    var deposit = Number(price) * 0.20;

    retval = {
        price : Number(price),
        address : address,
        link : link,
        imageSrc : imageSrc,
        type : getPropertyType(link),
        bed : bed,
        bath : bath,
        car : car,
        deals : {
            deposit: deposit,
            rentWeek: 0,
            rentAnnual: 0,
            expensesAnnual: 0,
            cashflowMonthly : 0,
            cashflowAnnual : 0
        }
    };

    return retval;
}

module.exports.reaSuburbScrape = reaSuburbScrape;
module.exports.reaGetSuburbStats = reaGetSuburbStats;