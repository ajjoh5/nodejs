'use strict';

var url = require('url');
var Lead = require('./LeadService');


module.exports.createLeadPost = function createLeadPost (req, res, next) {
  Lead.createLeadPost(req.swagger.params, res, next);
};
