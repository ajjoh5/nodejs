var format = require('string-format');
var async = require('async');
var _ = require('underscore');
var Q = require('q');


var reaRefactorListings = function(suburbSummary) {

    var deferred = Q.defer();

    if(!suburbSummary.listings) {
        deferred.reject(new Error('Listings in suburbSummary was null'));
    }

    //Setup summary for houses & units
    suburbSummary.summary.houses = {};
    suburbSummary.summary.units = {};


    var houseTypes = _.groupBy(suburbSummary.listings, function(item) {
        if(item.type == 'house') {
            return 'house';
        }
        else {
            return 'unit';
        }
    });

    console.log('[ Refactoring Houses ]');
    groupHouseTypes(houseTypes.house, suburbSummary.summary.houses);

    console.log('[ Refactoring Units ]');
    groupHouseTypes(houseTypes.unit, suburbSummary.summary.units);

    //var allGroups = _(suburbSummary.listings).groupBy('bed');
    //
    //var g = _.keys(allGroups);
    //_.each(g, function(i) {
    //
    //    console.log(format('  > Refactoring {0} Bed List', i));
    //
    //    var sortedListings = _.sortBy(allGroups[i], 'price');
    //
    //    var groupStats = {
    //        sumPrices : 0,
    //        average : 0,
    //        median : 0,
    //        total : allGroups[i].length,
    //        listings : sortedListings
    //    };
    //
    //    //suburbSummary.summary[format('{0}-bed-total', i)] = sortedListings.length;
    //    suburbSummary.summary[format('{0}-bed-stats', i)] = groupStats;
    //
    //    _.each(allGroups[i], function(item) {
    //        groupStats.sumPrices = groupStats.sumPrices + Number(item.price)
    //    });
    //
    //    //once finished summing all prices, calculate average, median, etc
    //    var m = getMedianValue(sortedListings, 'price');
    //    groupStats.median = m;
    //    groupStats.average = Math.floor((groupStats.sumPrices / sortedListings.length));
    //});

    deferred.resolve(suburbSummary);

    //deferred.reject(new Error(error));


    return deferred.promise;

};

function groupHouseTypes(listings, arrayToFill) {

    if(listings.length > 0) {

        var allGroups = _(listings).groupBy('bed');

        var g = _.keys(allGroups);
        _.each(g, function(i) {

            console.log(format('  > Refactoring {0} Bed List', i));

            var sortedListings = _.sortBy(allGroups[i], 'price');

            var groupStats = {
                sumPrices : 0,
                average : 0,
                median : 0,
                total : allGroups[i].length,
                listings : sortedListings
            };

            arrayToFill[format('{0}-bed-stats', i)] = groupStats;

            _.each(allGroups[i], function(item) {
                groupStats.sumPrices = groupStats.sumPrices + Number(item.price)
            });

            //once finished summing all prices, calculate average, median, etc
            var m = getMedianValue(sortedListings, 'price');
            groupStats.median = m;
            groupStats.average = Math.floor((groupStats.sumPrices / sortedListings.length));
        });
    }
}

function getMedianValue(array, field) {

    var retval = 0;
    if(array.length > 0) {
        var median = (array.length / 2);
        //console.log('median calc: ' + median);

        if(Math.floor(median) == median) {
            //EVEN

            retval = (Number(array[median - 1][field]) + Number(array[median][field])) / 2;
            //console.log(format('EVEN - median: {0} value: {1}', median, retval));
        }
        else {
            //DECIMAL

            median = Math.floor(median) + 1;
            retval = Number(array[median - 1][field]);
            //console.log(format('ODD - median: {0} value: {1}', median, retval));
        }
    }

    return retval;
}


module.exports.reaRefactorListings = reaRefactorListings;