//NodeJS Plugins
var fs = require('fs');
var path = require('path');
var _ = require('underscore');


// Constructor
function SPA(id, view, params) {

    var spa = {
        id : id,
        filepath : __dirname + '/' + id,
        params : []
    };

    //Get the ViewFile (passed in from the params)
    this.view = view ? view : 'default';
    this.viewFile = spa.filepath + '/' + this.view;

    //Set the View's Initial Params
    //this.viewParams = {
    //    layout : spa.filepath + '/layouts/layout',
    //    spa: spa,
    //    title: 'About Me',
    //    brand: 'Adam Johnstone',
    //    pageTitle : 'Adam Johnstone | A disruptive tech innovator and entrepreneur in Melbourne'
    //};

    //this.viewParams = {
    //    layout : spa.filepath + '/layouts/layout',
    //    spa: spa
    //};

    var vParams = {
        layout : spa.filepath + '/layouts/layout',
        spa: spa
    };

    this.viewParams = vParams;

    //Read Content File specific to this SPA
    var contentFileLocation = path.join(__dirname + '/content/' + id + '.json');
    var data = fs.readFileSync(contentFileLocation, 'utf8');
    var json = JSON.parse(data);

    //If json file exists
    if(json)
    {
        //If we are at the root SPA page, then serve all content nodes
        //eg. if we are at "http://website/blogs", then serve all "blogs"
        if(!view) {
            var rootNodes = [];
            _.each(json.nodes, function (nItem) {
                var nodeItem = {
                    name : nItem.name,
                    url : nItem.url
                };

                _.each(nItem.content, function (cItem) {
                    nodeItem[cItem.name] = cItem.content;
                });

                rootNodes.push(nodeItem);
            });

            vParams[id] = rootNodes;
        }
        else {

            var node = _.find(json.nodes, function (nItem) {
                return nItem.name === view;
            });

            //If the child node exists in the json file, then get all it's content
            if (node) {
                _.each(node.content, function (cItem) {
                    vParams[cItem.name] = cItem.content;
                });
            }
        }
    }
}

module.exports = SPA;