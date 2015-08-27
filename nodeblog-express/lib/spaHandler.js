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

function renderSPA(spaName, spaView, spaParams)
{

}

function saveSPA()
{

}


module.exports.renderSPA = renderSPA;
module.exports.saveSPA = saveSPA;