var testController = function(app) {

    var request = require("request");
    var cheerio = require("cheerio");
    var url = "http://www.realestate.com.au/buy/in-ascot+vale%2c+vic+3032/list-1";


    app.get('/test/hello', function(req, res) {
        var viewParams = {
            layout : __dirname + '/../views/layouts/layout',
            viewFile : __dirname + '/../views/hello',
            message : 'NPM World'
        };

        res.render(viewParams.viewFile, viewParams);
    });


    app.get('/test/scrape', function(req, res) {

        var priceListings = "";

        request(url, function (error, response, body) {
            if (!error) {
                var $ = cheerio.load(body)
                var listings = $("#searchResultsTbl").html();

                $('p.priceText').each(function(i, element){
                    //console.log($(this).text());
                    priceListings += $(this);
                });

                console.log("Found the listings");
                res.send(priceListings);
            } else {
                console.log("We’ve encountered an error: " + error);
                res.send(priceListings);
            }
        });
    });
}
module.exports = testController;