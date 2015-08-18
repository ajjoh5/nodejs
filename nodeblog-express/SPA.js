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
function SPA(id, view, params) {

    var spa = {
        id : id,
        filepath : __dirname + '/' + id,
        params : []
    };

    var editModeOn = isEditModeInParams(params);
    this.isEditModeOn = editModeOn;

    //Get the ViewFile (passed in from the params)
    this.view = view ? view : 'default';
    this.viewFile = spa.filepath + '/' + this.view;

    var vParams = {
        layout : spa.filepath + '/layouts/layout',
        spa: spa,
        view : this.view,
        isEditModeOn : editModeOn
    };

    //setup the vParams properties edit box
    vParams.properties = '<div class="row"><div class="col-md-12" style="background-color: #fafafa; border: 1px dashed #dedede;">{{properties}}</div></div>';
    this.viewParams = vParams;

    //Read Content File specific to this SPA
    var contentFileLocation = path.join(__dirname + '/content/' + id + '.json');
    var data = fs.readFileSync(contentFileLocation, 'utf8');
    var json = JSON.parse(data);

    //If json file exists
    if(json)
    {
        //If we are at the root SPA page, then serve all content nodes
        //eg. if we are at "http://website/blogs", then serve all child "blogs"
        if(!view) {
            var rootNodes = [];
            _.each(json.nodes, function (nItem) {
                var nodeItem = {
                    name : nItem.name,
                    url : nItem.url
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
                return nItem.name === view;
            });

            //If the child node exists in the json file, then get all it's content
            if (node) {
                _.each(node.contents, function (cItem) {

                    var contentToDisplay = cItem.value;

                    //if edit mode is on - then add editor widget
                    if(editModeOn == true) {
                        contentToDisplay = '<div class="spa-editor" data-content-name="' + cItem.name + '">' + contentToDisplay + '</div>';
                    }

                    vParams[cItem.name] = contentToDisplay;
                });

                //Cycle through the properties & 'if edit mode' create edit boxes, else just add to vparams
                var propertiesHTML = '';
                _.each(node.properties, function (pItem) {

                    var propertyToDisplay = pItem.value;
                    if(editModeOn == true) {
                        propertiesHTML += '<div class="form-group" style="margin: 40px 0;"><label for="' + pItem.name + '">' + pItem.name + ':</label><textarea data-property-name="' + pItem.name + '" data-property-description="' + pItem.description + '" rows="3" class="form-control">' + pItem.value + '</textarea><div id="helpCounter"></div> <span id="helpBlock" class="help-block">' + pItem.description + '</span></div>'
                    }

                    vParams[pItem.name] = propertyToDisplay;
                });

                //if edit mode is on - then add properties editor widget
                if(editModeOn == true) {
                    vParams['properties'] = vParams['properties'].replace(/{{properties}}/g, propertiesHTML);
                }
                else {
                    vParams['properties'] = '';
                }
            }
        }
    }
}

module.exports = SPA;