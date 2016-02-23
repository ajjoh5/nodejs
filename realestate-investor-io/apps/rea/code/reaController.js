var format = require('string-format');
var request = require("request");
var _ = require('underscore');
var dateFormat = require('dateformat');

//Include rea JS tools
var reajs = require(__base + '/lib/rea-tools-js');

var reaController = function(app) {

    //private functions
    String.prototype.toCamelCase = function() {
        var retval = this.toLowerCase();
        retval = retval.substr( 0, 1 ).toUpperCase() + retval.substr( 1 );

        return retval;
    };

    function getCurrentDateTime() {
        var now = new Date();
        return dateFormat(now, "yyyy-mm-dd HH:MM");
    }

    function getCurrentDate() {
        var now = new Date();
        return dateFormat(now, "yyyy-mm-dd");
    }


    //End Points
    app.get('/rea/hello', function(req, res) {
        var viewParams = {
            layout : __dirname + '/../views/layouts/layout',
            viewFile : __dirname + '/../views/hello',
            message : 'NPM World'
        };

        res.render(viewParams.viewFile, viewParams);
    });

    app.get('/db2', function(req, res) {
        var rebootjs = require('reboot-js');
        var db = rebootjs.getDB();

        db.initDB('scrapes', __base + '/data/scrapes.db');
        db.find('scrapes', {}).then(function(suburbData) {
            var allListings = [];

            _.each(suburbData, function(item) {
                allListings = _.union(allListings, item.results.listings);
            });

            res.send(allListings);
        });
    });

    app.get('/db', function(req, res) {

        var rebootjs = require('reboot-js');
        var db = rebootjs.getDB();

        db.initDB('suburbs', __base + '/data/suburbs.db');
        db.initDB('scrapes', __base + '/data/scrapes.db');

        //var suburb = {
        //    name : 'Adam',
        //    postCode : '3145',
        //    state : 'Victoria'
        //};
        //
        //db.insert('scrapes', suburb);

        //Business rule - Remove all of todays records, because we overwrite a day's writes, everytime we run
        db.remove('scrapes', { lastRun : getCurrentDate() }).then(function(numRemoved) {
            console.log('Records removed: ' + numRemoved);
        });

        db.find('suburbs', {}).then(function(suburbs) {

            _.each(suburbs, function(item) {
                var url = format('http://localhost:3001/rea/scrape/{0}/{1}/{2}', item.state, item.suburb, item.postCode);

                request(url, function (error, response, body) {
                    if (!error) {
                        var data = JSON.parse(body);
                        var suburb = {
                            suburb : data.name,
                            lastRun : getCurrentDate(),
                            results : data
                        };

                        db.insert('scrapes', suburb);
                    }
                    else { console.log('Error: ' + error); }
                });
            });

            res.send('Running 2');
        });

        res.send('Running 1');
    });

    app.get('/rea/scrape/:state/:suburb/:postcode', function(req, res) {

        var suburbNameEncoded = req.params.suburb;
        suburbNameEncoded = suburbNameEncoded.replace(/%20/, '+');
        suburbNameEncoded = suburbNameEncoded.replace(/ /, '+');

        var suburb = {
            'name' : req.params.suburb.toCamelCase(),
            'postCode' : req.params.postcode,
            'state' : req.params.state.toCamelCase(),
            'created' : getCurrentDateTime()
        };
        suburb.reaCode = format('{0}%2c+{1}+{2}', suburbNameEncoded.toLowerCase(), suburb.state.toLowerCase(), suburb.postCode);
        console.log(suburb.reaCode);

        //Scrape suburb - from URL params
        reajs.scrape.reaSuburbScrape(suburb)
        .then(function (data) {

                console.log(format('[ GET SUBURB STATS - {0}, {1} ]', suburb.name, suburb.postCode));

                reajs.scrape.reaGetSuburbStats(suburb).then(function (suburbStats) {

                console.log(format('[ REFACTOR LISTINGS - {0}, {1} ]', suburb.name, suburb.postCode));
                reajs.refactor.reaRefactorListings(data, suburbStats);

                res.send(data);

            });
        }, function (error) {
            console.log('ERRRRRR: ' + error);
            // All of the promises were rejected.
        });
    });


}

module.exports = reaController;