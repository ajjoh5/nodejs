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

    //Set the View's Initial Params
    //this.viewParams = {
    //    layout : spa.filepath + '/layouts/layout',
    //    spa: spa,
    //    title: 'About Me',
    //    brand: 'Adam Johnstone',
    //    pageTitle : 'Adam Johnstone | A disruptive tech innovator and entrepreneur in Melbourne'
    //};

    var vParams = {
        layout : spa.filepath + '/layouts/layout',
        spa: spa,
        view : this.view,
        isEditModeOn : editModeOn
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
        //eg. if we are at "http://website/blogs", then serve all child "blogs"
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

                    var contentToDisplay = cItem.content;
                    var isContentEditable = (cItem.name.indexOf('content.') > -1);

                    //if edit mode is on - then add editor widget
                    if(editModeOn == true && isContentEditable == true) {
                        contentToDisplay = '<div class="spa-editor" data-name="' + cItem.name + '">' + contentToDisplay + '</div>';
                    }

                    vParams[cItem.name] = contentToDisplay;
                });
            }
        }
    }
}

module.exports = SPA;