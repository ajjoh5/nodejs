var format = require('string-format');
var async = require('async');
var _ = require('underscore');
var Q = require('q');


var reaRefactorListings = function(suburbSummary, suburbStats) {

    var deferred = Q.defer();

    try {
        if(!suburbSummary.listings) {
            deferred.reject(new Error('Listings in suburbSummary was null'));
        }

        //Setup summary for houses & units
        suburbSummary.summary.houses = {};
        suburbSummary.summary.units = {};

        //Group listings into houses & units
        var houseTypes = _.groupBy(suburbSummary.listings, function(item) {
            if(item.type == 'house') {
                return 'house';
            }
            else {
                return 'unit';
            }
        });

        //Set totals for summary
        suburbSummary.summary.houses.total = houseTypes.house.length;
        suburbSummary.summary.units.total = houseTypes.unit.length;

        //Refactor houses
        console.log(format('[ Refactoring Houses - {0} ]', suburbSummary.name));
        groupHouseTypes('houses', houseTypes.house, suburbSummary.summary.houses, suburbStats.houses);

        //Refactor units
        console.log(format('[ Refactoring Units - {0} ]', suburbSummary.name));
        groupHouseTypes('units', houseTypes.unit, suburbSummary.summary.units, suburbStats.units);

        //return summary
        deferred.resolve(suburbSummary);
    }
    catch(error) {
        deferred.reject(new Error(error));
    }

    return deferred.promise;

};

function groupHouseTypes(propertyType, listings, arrayToFill, suburbStats) {

    if(listings.length > 0) {

        try {
            var allGroups = _(listings).groupBy('bed');

            var g = _.keys(allGroups);
            _.each(g, function(i) {

                console.log(format('  > Refactoring {0} Bed List', i));

                var sortedListings = _.sortBy(allGroups[i], 'price');

                var groupStats = {
                    sumPrices : 0,
                    average : 0,
                    median : 0,
                    rentMedian : 0,
                    rentalDemand : 0,
                    rentalProperties : 0,
                    total : allGroups[i].length,
                    listings : sortedListings
                };

                //Fill in relevant suburb stats
                if(suburbStats[i]) {
                    groupStats.rentMedian = Number(suburbStats[i]['investor_metrics']['median_rental_price']);
                    groupStats.rentalDemand = Number(suburbStats[i]['investor_metrics']['rental_demand']);
                    groupStats.rentalProperties = Number(suburbStats[i]['investor_metrics']['rental_properties']);
                }

                //calculate deals
                _.each(groupStats.listings, function(item) {
                    //Get annual rent
                    var rentAnnual = (groupStats.rentMedian * 52);

                    //Get annual expenses
                    var interestRate = 0.0499;
                    var mortgage = Number(item.price) * 0.80;
                    // (calculate property expenses by taking - annual mgmt fees + annual repairs + annual other costs + annual interest)
                    var propertyExpenses = Math.floor((rentAnnual * 0.07) + (rentAnnual * 0.025) + (rentAnnual * 0.05) + (mortgage * interestRate));
                    //Set annual expenses
                    item.deals.expensesAnnual = propertyExpenses;

                    //Calculate annual cashflow
                    var cashflowAnnual = rentAnnual - propertyExpenses;

                    item.deals.rentWeek = groupStats.rentMedian;
                    item.deals.rentAnnual = rentAnnual;
                    item.deals.cashflowMonthly = Math.floor(cashflowAnnual / 12);
                    item.deals.cashflowAnnual = cashflowAnnual;
                });

                //Fill in array with new group stats and listings info
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
        catch(error) {
            console.log(error);
        }
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