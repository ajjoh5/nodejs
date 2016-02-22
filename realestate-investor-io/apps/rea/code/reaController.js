var format = require('string-format');

//Include rea JS tools
var reajs = require(__base + '/lib/rea-tools-js');

var reaController = function(app) {

    app.get('/rea/hello', function(req, res) {
        var viewParams = {
            layout : __dirname + '/../views/layouts/layout',
            viewFile : __dirname + '/../views/hello',
            message : 'NPM World'
        };

        res.render(viewParams.viewFile, viewParams);
    });

    String.prototype.toCamelCase = function() {
        var retval = this.toLowerCase();
        retval = retval.substr( 0, 1 ).toUpperCase() + retval.substr( 1 );

        return retval;
    };

    app.get('/rea/scrape/:state/:suburb/:postcode', function(req, res) {

        var suburbNameEncoded = req.params.suburb;
        suburbNameEncoded = suburbNameEncoded.replace(/%20/, '+');
        suburbNameEncoded = suburbNameEncoded.replace(/ /, '+');

        var suburb = {
            'name' : req.params.suburb.toCamelCase(),
            'postCode' : req.params.postcode,
            'state' : req.params.state.toCamelCase()
        };
        suburb.reaCode = format('{0}%2c+{1}+{2}', suburbNameEncoded.toLowerCase(), suburb.state.toLowerCase(), suburb.postCode);
        console.log(suburb.reaCode);

        //Scrape suburb - from URL params
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

module.exports = reaController;