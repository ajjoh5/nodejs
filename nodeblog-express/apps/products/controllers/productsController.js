//NodeJS Plugins
var path = require('path');

//app = express app
function productsController(app) {

    //init variables
    var appDir = path.dirname(require.main.filename);

    //App Custom Plugins
    var SPA = require(appDir + '/lib/SPA.js');
    var spav2 = require(appDir + '/lib/spav2.js');
    var utilities = require(appDir + '/lib/utilities.js');

    function newProduct() {
        var sid = utilities.generateShortID();

        //Class Template
        return {
            name : 'New Product ID - ' + sid,
            url : 'new-product-' + sid,
            contents: [
                {
                    name: "product-text",
                    value: ""
                }
            ],
            properties : [
                {
                    "name": "meta-description",
                    "description": "The meta-description must contain the primary keyword / phrase and be no longer than 156 characters",
                    "value": "meta-description here"
                },
                {
                    "name": "page-title",
                    "description": "The page title must contain the primary keyword / phrase and be no longer than 70 characters",
                    "value": "New Node ID - " + sid
                },
                {
                    name: "more-text",
                    value: "more text here"
                },
                {
                    name: "featured-image",
                    value: "http://image"
                },
                {
                    name: "author",
                    value: "Admin"
                },
                {
                    name: "publish-date",
                    value: utilities.formatDate(new Date())
                }
            ]
        };
    }

    // [ NEW ] - products
    app.get('/products/new', utilities.cmsMiddleware, function(req, res) {

        var product = newProduct();

        var app = {
            name : 'products',
            view : product.url,
            viewFile : 'product',
            layoutFile : 'layout',
            params : req.params
        };

        //init spa
        spav2.initSPA(app);

        //Save the new blog and redirect to it
        spav2.newSPA(app, product, function(err, data) {
            res.redirect(app.view);
        });
    });

    // products View + products EDIT view
    app.get('/products(/edit)?', utilities.cmsMiddleware, function(req, res) {

        var app = {
            name : 'products',
            isRoot : true,
            params : req.params
        };

        var viewParams = spav2.initSPA(app);

        res.render(app.viewFile, viewParams);
    });

    // Generic Catch All Blog Article Views
    app.get('/products/*', utilities.cmsMiddleware, function(req, res) {

        var urlParams = utilities.removeLastSlash(req.params[0]).split('/');

        var app = {
            name : 'products',
            view : urlParams[0],
            viewFile : 'product',
            params : req.params
        };

        var viewParams = spav2.initSPA(app);

        res.render(app.viewFile, viewParams);
    });

}

module.exports = productsController;