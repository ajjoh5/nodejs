var dealsController = function(app) {

    var request = require('request');
    var format = require('string-format');

    app.get('/deals-home', function(req, res) {

        var viewParams = {
            layout : __dirname + '/../views/layouts/layout',
            viewFile : __dirname + '/../views/deals-home',
            'action-button' : '<span class="glyphicon glyphicon-user" aria-hidden="true"></span> Logout'
        };

        res.render(viewParams.viewFile, viewParams);
    });

    app.get('/cashflow-deals', function(req, res) {

        var viewParams = {
            layout : __dirname + '/../views/layouts/layout',
            viewFile : __dirname + '/../views/cashflow-deals',
            'action-button' : '<span class="glyphicon glyphicon-user" aria-hidden="true"></span> Logout'
        };

        res.render(viewParams.viewFile, viewParams);
    });

    app.get('/api/deals/:state/:suburb/:postcode', function(req, res) {

        //setup default values
        var state = (req.params.state) ? req.params.state : 'Victoria';
        var suburb = (req.params.suburb) ? req.params.suburb : 'Kensington';
        var postcode = (req.params.postcode) ? req.params.postcode : '3031';
        var url = format('http://localhost:3001/rea/scrape/{0}/{1}/{2}', state, suburb, postcode);

        //Check the status code of the request for errors. If the response is an error log the error return result.
        request(url,function(error, response, body){
            if(!error && response.statusCode == 200){

                var data = JSON.parse(body);
                res.send(data);
            }
            else {
                res.send(error);
                return false;
            }
        });

    });
};

module.exports = dealsController;

