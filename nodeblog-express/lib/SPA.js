//NodeJS Plugins
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var shortid = require('shortid');

function FileExists(fileName) {
    var retval = false;

    try {
        var stats = fs.statSync(fileName);
        if (stats.isFile()) {
            retval = true;
        }
        else {
            retval = false;
        }
    }
    catch(err) {
        console.log('Filename Error: ' + fileName);
    }

    return retval;
}

function readConfigFile(filename) {
    var data = '';

    try {
        data = fs.readFileSync(filename, 'utf8');
    }
    catch(ex) {
        console.log('ERROR: Failed to read file: ' + filename);
        console.log(ex);
    }

    return data;
}

function InitSPA(spa, spaName, spaView, spaViewFile, spaLayout, spaParams) {

    //init SPA settings
    var appDir = path.dirname(require.main.filename);

    spa.id = spaName;
    spa.view = spaView;

    //Init all the paths
    spa.relativePath = '/apps/' + spaName;
    spa.filePath = appDir + spa.relativePath;
    spa.viewPath = spa.filePath + '/views/';
    spa.contentPath = spa.filePath + '/data/';
    spa.layoutPath = spa.viewPath + '/layouts/';

    //Init all the file locations
    spa.viewFile = spaViewFile ? spa.viewPath + spaViewFile : spaView ? spa.viewPath + spaView : spa.viewPath + 'default';
    console.log('Serving ViewFile: ' + spa.viewFile);
    if(!FileExists(spa.viewFile + '.handlebars')) {
        spa.viewFile = spa.viewPath + 'default';
    }

    spa.contentFile = spa.contentPath + '/' + spa.id + '.json';
    spa.layoutFile = spaLayout ? spa.layoutPath + spaLayout : spa.layoutPath + '/layout';

    //Init the other important properties
    spa.isAuthenticated = !spaParams.isAuthenticated ? false : spaParams.isAuthenticated;
    spa.isEditModeOn = !spaParams.isEditModeOn ? false : spaParams.isEditModeOn;

    //INit HTML properties
    spa.rootPropertiesHTML = readConfigFile(appDir + '/apps/_app/views/spa-root-properties.handlebars');
}

function processSPAContent(spa, vParams) {

    //Read Content File specific to this SPA
    var json = {};

    try {
        var data = fs.readFileSync(spa.contentFile, 'utf8');
        json = JSON.parse(data);
    }
    catch(ex) {
        console.log('ERROR: Failed to read content file: ' + spa.contentFile);
        console.log(ex);
    }

    //If json file exists
    if (json) {
        //If we are at the root SPA page, then serve all content nodes
        //eg. if we are at "http://website/blogs", then serve all child "blogs"

        if (!spa.view) {

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

            //var propertiesHTML = '<div class="form-group" style="margin: 40px 0;"><button id="btnAdd" class="btn btn-info" onclick="New()">Add ' + spa.id + '</button></div>';
            propertiesHTML = spa.rootPropertiesHTML ? spa.rootPropertiesHTML : '<strong>No properties loaded.</strong>';

            //if edit mode is on - then add properties editor widget
            if (spa.isAuthenticated && spa.isEditModeOn == true) {
                propertiesHTML = '';
                vParams['properties'] = vParams['properties'].replace(/{{properties}}/g, propertiesHTML);
            }
            else {
                vParams['properties'] = vParams['properties'].replace(/{{properties}}/g, propertiesHTML);

                //vParams['properties'] = '';
            }

            vParams[spa.id] = rootNodes;
        }
        else {

            //NOT ROOT NODE
            var node = _.find(json.nodes, function (nItem) {
                return nItem.url === spa.view;
            });

            //If the child node exists in the json file, then get all it's content
            if (node) {
                _.each(node.contents, function (cItem) {

                    var contentToDisplay = cItem.value;

                    //if edit mode is on - then add editor widget
                    if (spa.isAuthenticated && spa.isEditModeOn == true) {
                        contentToDisplay = '<div class="spa-editor" data-content-name="' + cItem.name + '">' + contentToDisplay + '</div>';
                    }

                    vParams[cItem.name] = contentToDisplay;
                });

                //Cycle through the properties & 'if edit mode' create edit boxes, else just add to vparams
                var propertiesHTML = '';
                _.each(node.properties, function (pItem) {

                    var propertyToDisplay = pItem.value;
                    if (spa.isAuthenticated && spa.isEditModeOn == true) {
                        propertiesHTML += '<div class="form-group" style="margin: 40px 0;"><label for="' + pItem.name + '">' + pItem.name + ':</label><textarea data-property-name="' + pItem.name + '" data-property-description="' + pItem.description + '" rows="3" class="form-control">' + pItem.value + '</textarea><div id="helpCounter"></div> <span id="helpBlock" class="help-block">' + pItem.description + '</span></div>'
                    }

                    vParams[pItem.name] = propertyToDisplay;
                });

                //if edit mode is on - then add properties editor widget
                if (spa.isAuthenticated && spa.isEditModeOn == true) {
                    vParams['properties'] = vParams['properties'].replace(/{{properties}}/g, propertiesHTML);
                }
                else {
                    vParams['properties'] = '';
                }
            }
        }
    }
}

// Constructor
function SPA(spaName, spaView, spaViewFile, spaLayout, spaParams) {

    var spa = {};

    //Init the SPA settings
    InitSPA(spa, spaName, spaView, spaViewFile, spaLayout, spaParams);

    //Get the ViewFile (passed in from the params)
    this.viewFile = spa.viewFile;

    //Set the View Params
    //(ensure 'layout' exists as this override the default layout location)
    var vParams = {};
    vParams.spa = spa;
    vParams.layout = spa.layoutFile;
    vParams.properties = '<div class="row"><div class="col-md-12" style="background-color: #fafafa; border: 1px dashed #dedede;">{{properties}}</div></div>';

    //Get the Views Params (ViewParams)
    this.viewParams = vParams;

    //Process this view's SPA content (from the content file) and load it in
    processSPAContent(spa, vParams);
}

// Constructor
function SPA2(obj) {

    var spa = {};

    //Init the SPA settings
    InitSPA(spa, obj.name, obj.view, obj.viewFile, obj.layout, obj.params);

    //Get the ViewFile (passed in from the params)
    this.viewFile = spa.viewFile;

    //Set the View Params
    //(ensure 'layout' exists as this override the default layout location)
    var vParams = {};
    vParams.spa = spa;
    vParams.layout = spa.layoutFile;
    vParams.properties = '<div class="row"><div class="col-md-12" style="background-color: #fafafa; border: 1px dashed #dedede;">{{properties}}</div></div>';

    //Get the Views Params (ViewParams)
    this.viewParams = vParams;

    //Process this view's SPA content (from the content file) and load it in
    processSPAContent(spa, vParams);
}

function saveSPA(spaName, spaView, spaLayout, spaParams, post, callback) {

    var spa = {};

    //Init the SPA settings
    InitSPA(spa, spaName, spaView, null, spaLayout, spaParams);

    //Get existing data file
    var data = fs.readFileSync(spa.contentFile, 'utf8');
    var json = JSON.parse(data);

    //Get the node we are interested in
    var node = _.find(json.nodes, function (nItem) {
        return nItem.name === spaView;
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

function newSPA(spaName, spaView, spaLayout, spaParams, post, callback) {

    var spa = {};

    //Init the SPA settings
    InitSPA(spa, spaName, spaView, spaViewFile, spaLayout, spaParams);

    //Get existing data file
    var data = fs.readFileSync(spa.contentFile, 'utf8');
    var json = JSON.parse(data);

    var sid = shortid.generate();

    //Get the node we are interested in
    var newNode = {
        name : 'New Node ID - ' + sid,
        url : 'new-node-' + sid,
        contents : [],
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
        }
    ]
    };

    json.nodes.push(newNode);

    //Write new content + properties to existing file
    fs.writeFile(spa.contentFile, JSON.stringify(json), function(err) {
        if(err) {
            return callback(err, null);
        }

        return callback(null, 'File was successfully saved.');
    });

}

function newSPA(obj, newSPA, post, callback) {

    var spa = {};

    //Init the SPA settings
    InitSPA(spa, obj.name, obj.view, obj.viewFile, obj.layout, obj.params);

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
            return callback(err, null);
        }

        return callback(null, 'File was successfully saved.');
    });

}

module.exports = SPA;
module.exports.saveSPA = saveSPA;
module.exports.newSPA = newSPA;