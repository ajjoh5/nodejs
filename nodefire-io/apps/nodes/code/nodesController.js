//Reboot Plugins
var rebootUtilities = require(__base + 'lib/reboot-js/reboot-utilities');
var rebootDB = require(__base + 'lib/reboot-js/reboot-db');
var _ = require('underscore');

var nodesController = function(app) {

    var nodesHTML = '';
    rebootDB.initDB('nodes', __dirname + '/../data/nodes.db');
    rebootDB.insert('nodes', { name: 'adam'});
    var docs = rebootDB.find('nodes', {});

    // Generic Catch All SPA Views (put in last)
    app.get('/nodes/?', function(req, res) {

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

            //Check to see if link field exists, and if so, create link
            var linkField = _.find(item.fields, function(field) {
                if(field.type.toLowerCase() == 'link' && field.value) {
                    return field;
                }
            });
            //Set link
            var link = (linkField) ? '<a href="' + linkField.value + '">' + item.name + '</a>' : item.name;


            //item type = web
            if(item.type.toLowerCase() == 'web') {
                liString = "<li data-jstree='{\"icon\" : \"/js/icons/web_02.png\"}'>" + link;
            }

            //item type = content-page-1
            if(item.type.toLowerCase() == 'content-page-1') {
                liString = "<li data-jstree='{\"icon\" : \"/js/icons/doc_01.png\"}'>" + link;
            }

            //item type = snippet-1
            if(item.type.toLowerCase() == 'snippet-1') {
                liString = "<li data-jstree='{\"icon\" : \"/js/icons/doc_02.png\"}'>" + link;
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

module.exports = nodesController;