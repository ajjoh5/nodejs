'use strict';

exports.createLeadPost = function(args, res, next) {
  /**
   * parameters expected in the args:
   * lead (Lead)
   **/

var examples = {};
  
  examples['application/json'] = {
  "Storey" : "aeiou",
  "MoreInfoHomeDesign" : 1.3579000000000001069366817318950779736042022705078125,
  "InputSource" : 1.3579000000000001069366817318950779736042022705078125,
  "Email" : "aeiou",
  "LandStatus" : 1.3579000000000001069366817318950779736042022705078125,
  "FirstName" : "aeiou",
  "Comments" : "aeiou",
  "StepByStepGuide" : 1.3579000000000001069366817318950779736042022705078125,
  "CollectionInterestedIn" : "aeiou",
  "LeadRegion" : 1.3579000000000001069366817318950779736042022705078125,
  "LeadBrand" : 1.3579000000000001069366817318950779736042022705078125,
  "MobilePhone" : "aeiou",
  "Subject" : "aeiou",
  "WhenMoveIn" : "aeiou",
  "PriceRange" : 1.3579000000000001069366817318950779736042022705078125,
  "LandFrontage" : 1.3579000000000001069366817318950779736042022705078125,
  "SubscribeToNews" : 1.3579000000000001069366817318950779736042022705078125,
  "PreferredContact" : "aeiou",
  "LeadSalesUnit" : 1.3579000000000001069366817318950779736042022705078125,
  "LastName" : "aeiou",
  "LandSuburb" : "aeiou",
  "LandSize" : 1.3579000000000001069366817318950779736042022705078125,
  "FreeSiteAssessment" : 1.3579000000000001069366817318950779736042022705078125
};
  

  
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
  
}
