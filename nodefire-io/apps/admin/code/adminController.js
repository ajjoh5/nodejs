//Reboot Plugins
var rebootUtilities = require(__base + 'lib/reboot-js/reboot-utilities');
var _ = require('underscore');

var adminController = function(app) {

    var nodesHTML = '';

    // Generic Catch All SPA Views (put in last)
    app.get('/admin/?', function(req, res) {

        nodesHTML = '<ul class="collapsibleList">';
        var json = rebootUtilities.rbJsonFileSync(__dirname + '/../data/nodes.json');

        listNodes(json.nodes);

        var viewParams = {
            layout : __dirname + '/../views/layouts/layout',
            viewFile : __dirname + '/../views/index',
            nodesHTML : nodesHTML
        };

        //res.send('1 was selected');
        res.render(viewParams.viewFile, viewParams);
    });

    function listNodes(parentItem) {
        _.each(parentItem, function(item) {
            var liString = '<li>' + item.name;
            if(item.type.toLowerCase() == 'web') {
                liString = "<li data-jstree='{\"icon\" : \"/js/icons/web_02.png\"}'>" + item.name;
            }
            if(item.type.toLowerCase() == 'content-page-1') {
                liString = "<li data-jstree='{\"icon\" : \"/js/icons/doc_01.png\"}'>" + item.name;
            }
            if(item.type.toLowerCase() == 'snippet-1') {
                liString = "<li data-jstree='{\"icon\" : \"/js/icons/doc_02.png\"}'>" + item.name;
            }
            nodesHTML += liString;
            //console.log(item.name);
            //if item has child nodes, then list them
            if(item.nodes) {
                nodesHTML += '<ul>';
                listNodes(item.nodes);
            }
            nodesHTML += '</li>';
        });
        nodesHTML += '</ul>';
    }
}

module.exports = adminController;