//The 'Get all Active and Published Packages' Runway API
//https://henley.runway.com.au/api/2/packages?ModifiedSince=01/01/2015


//The Search Runway API
//https://henley.runway.com.au/api/2/search/packages?query=RangeName%3DMainVue+VIC


//The Package ID specific Runway API
//https://henley.runway.com.au/api/2/packages/00104O3A8D3P1Z5L9Q346D061W3S?View=Extended


//'use strict';

// Plugins
var request = require('request');
var _ = require('underscore');

// Properties
var JSESSIONID = '';

function loginToRunway(callback) {
    console.log('[ Login - Runway ]');
    //console.log('JSID: ' + jsid);

    //Create cookie jar
    var jar = request.jar();

    //Username / Password
    var data = {
        Username : 'ajohnstone',
        Password : 'welcome'
    };

    //Send get JSID request
    request({
        uri: 'http://henley.runway.com.au/actions/loginaction.jsp',
        method: 'POST',
        form: data,
        jar: jar
    }, function(error, response, body) {

        var cjson = JSON.stringify(jar._jar);
        var cList = JSON.parse(cjson);
        var runwayCookie = _.find(cList.cookies, function(item){ return item.key === 'JSESSIONID'; });

        JSESSIONID = runwayCookie.value;
        //console.log('JSID: ' + jsid);

        callback(JSESSIONID);
    });
}

// GET - Last 6 months of Published Runway Packages
function GetPublishedRunwayPackages(jsid, callback) {

    console.log('[ Last 6 Months Published Packages - Runway ]');

    //If no JSID, then login again
    if(jsid)
    {
        console.log('- JSID: ' + jsid);

        var cDate = new Date();
        cDate.setMonth(cDate.getMonth() - 6);
        var currDateString = cDate.getDate() + '/' + (cDate.getMonth() + 1) + '/' +  cDate.getFullYear();

        var jar = request.jar();
        var cookie = request.cookie('JSESSIONID=' + jsid);

        var apiUrl = 'https://henley.runway.com.au/api/2/packages?ModifiedSince=' + currDateString;
        console.log('- ' + apiUrl);
        jar.setCookie(cookie, apiUrl);

        var options = {
            url: apiUrl,
            jar: jar
        };

        request.get(options, function (error, response, body) {
            var json = JSON.parse(body);
            callback(error, json);
        });
    }
}

// GET - Last 6 months of runway packages
function GetRangePackages(jsid, rangeName, callback) {

    console.log('[ Range Packages - Runway ]');

    //If no JSID, then login again
    if (jsid && rangeName) {

        rangeName = encodeURIComponent(rangeName);

        console.log('- JSID: ' + jsid);
        console.log('- Range Name: ' + rangeName);

        var jar = request.jar();
        var cookie = request.cookie('JSESSIONID=' + jsid);

        var apiUrl = 'https://henley.runway.com.au/api/2/search/packages?query=RangeName%3D' + rangeName;
        console.log('- ' + apiUrl);
        jar.setCookie(cookie, apiUrl);

        var options = {
            url: apiUrl,
            jar: jar
        };

        request.get(options, function (error, response, body) {
            var json = JSON.parse(body);
            callback(error, json);
        });
    }
}


//GET - Extended View of Package ID
function GetPackageByIDExtendedView(jsid, packageID, callback) {

    console.log('[ Package by ID - Extended View - Runway ]');

    //If no JSID, then login again
    if (jsid && packageID) {

        console.log('- JSID: ' + jsid);
        console.log('- Package ID: ' + packageID);

        var jar = request.jar();
        var cookie = request.cookie('JSESSIONID=' + jsid);

        var apiUrl = 'https://henley.runway.com.au/api/2/packages/' + packageID + '?View=Extended';
        console.log('- ' + apiUrl);
        jar.setCookie(cookie, apiUrl);

        var options = {
            url: apiUrl,
            jar: jar
        };

        request.get(options, function (error, response, body) {
            var json = JSON.parse(body);
            callback(error, json);
        });
    }
}

function JoinPublishedAndRangePackages(publishedPackages, rangePackages, rangeName, callback) {

    console.log('[ Join Published + Range Packages - Underscore ]');

    var joinedPackages = [];

    _.each(publishedPackages, function(item) {

        //if (item.Plan.Home.Range.Name == 'MainVue VIC' && item.Publishing.Status == 'Published')
        if (item.Plan.Home.Range.Name == rangeName && item.Publishing.Status == 'Published')
        {
            //Get the Home Package from "Search" Packages that matches the one in the "Default" packages
            var sHomePackage = _.find(rangePackages, function (sItem) {
                return sItem.ProductID === item.PackageID;
            });

            var jPackage = {
                PackageID: item.PackageID,
                Name : '---',
                DisplayPrice : '---',
                City: '---',
                Region: item.Location.Parent.Name,
                Estate: item.Lot.Stage.Estate.Name,
                LotID: item.Lot.LotID,
                Lot: item.Lot.Name,
                LotWidth: sHomePackage.LotWidth ? sHomePackage.LotWidth : '',
                LotArea: sHomePackage.LotArea ? sHomePackage.LotArea : '',
                HomeID: item.Plan.Home.HomeID,
                Home: (item.Plan.Home.Name + ' ' + item.Plan.Name),
                HomeSize: '---',
                HomePrice: item.Price,
                HomeArea: sHomePackage.HomeArea ? sHomePackage.HomeArea : '',
                Storeys: sHomePackage.Storeys ? sHomePackage.Storeys : '',
                Bedrooms: sHomePackage.Bedrooms ? sHomePackage.Bedrooms : '',
                Bathrooms: sHomePackage.Bathrooms ? sHomePackage.Bathrooms : '',
                CarParks: sHomePackage.CarParks ? sHomePackage.CarParks : '',
                PDFFile: item.PropertyPDFURL,
                LotThumbnail : '---',
                Image : '---',
                PlanImage : '---',
                FacadeName : '---',
                Publishing : '---',
                VisibilityStatus : '---'
            };

            joinedPackages.push(jPackage);
        }
    });

    callback(null, joinedPackages);
}



module.exports.loginToRunway = loginToRunway;
module.exports.GetPublishedRunwayPackages = GetPublishedRunwayPackages;
module.exports.GetRangePackages = GetRangePackages;
module.exports.GetPackageByIDExtendedView = GetPackageByIDExtendedView;
module.exports.JoinPublishedAndRangePackages = JoinPublishedAndRangePackages;
