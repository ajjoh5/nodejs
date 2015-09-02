//NodeJS Plugins
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var shortid = require('shortid');

var appDir = path.dirname(require.main.filename);


// Inits the SPA and returns the ViewParams for the view
function initSPA(spa) {

    spa.id = spa.name;

    //Init all the paths
    spa.relativePath = '/apps/' + spa.name;
    spa.filePath = appDir + spa.relativePath;
    spa.viewPath = spa.filePath + '/views/';
    spa.contentPath = spa.filePath + '/data/';
    spa.layoutPath = spa.viewPath + '/layouts/';

    //Init all the view file locations
    if(!spa.viewFile && spa.isRoot) {
        spa.viewFile = spa.viewPath + 'root';
    }
    else {
        //If the viewFile is just a file, then add the view path to complete it
        if(spa.viewFile && spa.viewFile.indexOf('/') == -1) {
            spa.viewFile = spa.viewPath + spa.viewFile;
        }
        else {
            spa.viewFile = spa.viewPath + spa.view;
        }
    }

    //Init the layout file locations
    if(!spa.layoutFile) {
        //spa.layoutFile = spa.layoutPath + '/layout';
        spa.layoutFile = appDir + '/apps/_app/views/layouts/layout';
    }
    else {
        //If the viewFile is just a file, then add the view path to complete it
        if(spa.layoutFile.indexOf('/') == -1) {
            spa.layoutFile = spa.layoutPath + spa.layoutFile;
        }
    }
    //setup the spa layout
    spa.layout = spa.layoutFile;


    spa.contentFile = spa.contentPath + '/' + spa.id + '.json';

    //Init the other important properties
    spa.isAuthenticated = !spa.params.isAuthenticated ? false : spa.params.isAuthenticated;
    spa.isEditModeOn = !spa.params.isEditModeOn ? false : spa.params.isEditModeOn;

    var viewParams = {
        spa : spa,
        layout : spa.layout,
        properties : ''
    };

    //Get the views params
    getViewParams(spa, viewParams);

    return viewParams;
}

function getViewParams(spa, viewParams) {

    //Read Content File specific to this SPA
    var json = {};

    try {
        var data = fs.readFileSync(spa.contentFile, 'utf8');
        //console.log('Loaded content file: ' + spa.contentFile);
        json = JSON.parse(data);
        //console.log(data);
    }
    catch(ex) {
        console.log('ERROR: Failed to read content file: ' + spa.contentFile);
        console.log(ex);
    }

    //If json file exists
    if (json) {
        //If we are at the root SPA page, then serve all content nodes
        //eg. if we are at "http://website/blogs", then serve all child "blogs"

        if (spa.isRoot) {

            if (process.env.NODE_ENV == 'development' ) { console.log('Root node: ' + spa.view); }

            //THIS IS THE ROOT NODE
            var rootNodes = [];
            _.each(json.nodes, function (nItem) {
                var nodeItem = {
                    name: nItem.name,
                    url: nItem.url
                };

                _.each(nItem.contents, function (cItem) {
                    nodeItem[cItem.name] = cItem.value;
                });

                _.each(nItem.properties, function (pItem) {
                    nodeItem[pItem.name] = pItem.value;
                });

                rootNodes.push(nodeItem);
            });

            viewParams[spa.id] = rootNodes;
        }
        else {

            //NOT ROOT NODE
            var node = _.find(json.nodes, function (nItem) {
                return nItem.url == spa.view;
            });

            //If the child node exists in the json file, then get all it's content
            if (node) {

                if (process.env.NODE_ENV == 'development' ) { console.log('SPA Child - Found spa with url: ' + spa.view); }
                _.each(node.contents, function (cItem) {

                    var contentToDisplay = cItem.value;

                    //if edit mode is on - then add editor widget
                    if (spa.isAuthenticated && spa.isEditModeOn == true) {
                        contentToDisplay = '<div class="spa-editor" data-content-name="' + cItem.name + '">' + contentToDisplay + '</div>';
                    }

                    viewParams[cItem.name] = contentToDisplay;
                });

                viewParams.properties = node.properties;

                _.each(node.properties, function (pItem) {
                    var propertyToDisplay = pItem.value;
                    viewParams[pItem.name] = propertyToDisplay;
                });
            }
        }
    }
}

function newSPA(spa, newSPA, callback) {

    //Get existing data file
    var data = fs.readFileSync(spa.contentFile, 'utf8');
    var json = JSON.parse(data);

    var newNode = {};
    if(!newSPA) {
        newNode = {
            name: 'New Node ID - ' + sid,
            url: 'new-node-' + sid,
            contents: [],
            properties: []
        };
    }
    else {
        newNode = newSPA;
    }

    json.nodes.push(newNode);

    //Write new content + properties to existing file
    fs.writeFile(spa.contentFile, JSON.stringify(json), function(err) {
        if(err) {
            callback(err, null);
        }

        callback(null, 'File was successfully saved.');
    });

}

function saveSPA(spa, post, callback) {

    //Get existing data file
    var data = fs.readFileSync(spa.contentFile, 'utf8');
    var json = JSON.parse(data);

    //Get the node we are interested in
    var node = _.find(json.nodes, function (nItem) {
        return nItem.url === spa.view;
    });

    //Replace only the node's contents array values
    node.contents = post.body.contents;
    node.properties = post.body.properties;

    //Write new content + properties to existing file
    fs.writeFile(spa.contentFile, JSON.stringify(json), function(err) {
        if(err) {
            return callback(err, null);
        }

        return callback(null, 'File was successfully saved.');
    });

}


module.exports.initSPA = initSPA;
module.exports.newSPA = newSPA;
module.exports.saveSPA = saveSPA;