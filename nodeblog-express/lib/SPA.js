//NodeJS Plugins
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

function isEditModeInParams(params)
{
    var isEditMode = false;

    var param = _.find(params, function (item) {
        return item.toUpperCase() === 'EDIT';
    });

    if(param) {
        isEditMode = true;
    }

    return isEditMode;
}

// Constructor
function SPA(id, sView, params) {

    var spa = {
        id: id,
        relpath: '/apps/' + id,
        view: sView ? sView : 'default',
        editModeOn: isEditModeInParams(params),
        params: []
    };

    //Setup other dynamic properties
    var appDir = path.dirname(require.main.filename);
    spa.filepath = appDir + spa.relpath;
    spa.viewpath = spa.filepath + '/views/';
    spa.contentpath = spa.filepath + '/data/';
    spa.contentFile = spa.contentpath + '/' + spa.id + '.json';
    spa.layout = spa.viewpath + '/layouts/layout';

    //Get the ViewFile (passed in from the params)
    this.viewFile = spa.viewpath + spa.view;

    //Set the View Params
    //(ensure 'layout' exists as this override the default layout location)
    var vParams = {
        spa: spa,
        layout: spa.layout
    };

    //setup the vParams properties edit box
    vParams.properties = '<div class="row"><div class="col-md-12" style="background-color: #fafafa; border: 1px dashed #dedede;">{{properties}}</div></div>';
    this.viewParams = vParams;

    //Read Content File specific to this SPA
    var data = fs.readFileSync(spa.contentFile, 'utf8');
    var json = JSON.parse(data);

    //If json file exists
    if (json) {
        //If we are at the root SPA page, then serve all content nodes
        //eg. if we are at "http://website/blogs", then serve all child "blogs"
        if (!sView) {
            var rootNodes = [];
            _.each(json.nodes, function (nItem) {
                var nodeItem = {
                    name: nItem.name,
                    url: nItem.url
                };

                _.each(nItem.contents, function (cItem) {
                    nodeItem[cItem.name] = cItem.value;
                });

                rootNodes.push(nodeItem);
            });

            vParams[id] = rootNodes;
        }
        else {

            var node = _.find(json.nodes, function (nItem) {
                return nItem.name === sView;
            });

            //If the child node exists in the json file, then get all it's content
            if (node) {
                _.each(node.contents, function (cItem) {

                    var contentToDisplay = cItem.value;

                    //if edit mode is on - then add editor widget
                    if (spa.editModeOn == true) {
                        contentToDisplay = '<div class="spa-editor" data-content-name="' + cItem.name + '">' + contentToDisplay + '</div>';
                    }

                    vParams[cItem.name] = contentToDisplay;
                });

                //Cycle through the properties & 'if edit mode' create edit boxes, else just add to vparams
                var propertiesHTML = '';
                _.each(node.properties, function (pItem) {

                    var propertyToDisplay = pItem.value;
                    if (spa.editModeOn == true) {
                        propertiesHTML += '<div class="form-group" style="margin: 40px 0;"><label for="' + pItem.name + '">' + pItem.name + ':</label><textarea data-property-name="' + pItem.name + '" data-property-description="' + pItem.description + '" rows="3" class="form-control">' + pItem.value + '</textarea><div id="helpCounter"></div> <span id="helpBlock" class="help-block">' + pItem.description + '</span></div>'
                    }

                    vParams[pItem.name] = propertyToDisplay;
                });

                //if edit mode is on - then add properties editor widget
                if (spa.editModeOn == true) {
                    vParams['properties'] = vParams['properties'].replace(/{{properties}}/g, propertiesHTML);
                }
                else {
                    vParams['properties'] = '';
                }
            }
        }
    }
}

function saveSPA(id, sView, params, post, callback) {

    var spa = {
        id: id,
        relpath: '/apps/' + id,
        view: sView ? sView : 'default',
        editModeOn: isEditModeInParams(params),
        params: []
    };

    //Setup other dynamic properties
    var appDir = path.dirname(require.main.filename);
    spa.filepath = appDir + spa.relpath;
    spa.viewpath = spa.filepath + '/views/';
    spa.contentpath = spa.filepath + '/data/';
    spa.contentFile = spa.contentpath + '/' + spa.id + '.json';
    spa.layout = spa.viewpath + '/layouts/layout';

    //Get existing data file
    var data = fs.readFileSync(spa.contentFile, 'utf8');
    var json = JSON.parse(data);

    //Get the node we are interested in
    var node = _.find(json.nodes, function (nItem) {
        return nItem.name === sView;
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

module.exports = SPA;
module.exports.saveSPA = saveSPA;