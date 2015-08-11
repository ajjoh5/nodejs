//Private functions
function removeLastSlash(myUrl) {
    if (myUrl.substring(myUrl.length-1) === '/') {
        myUrl = myUrl.substring(0, myUrl.length-1);
    }

    return myUrl;
}

//Constructor method
function getExpressParams(routeParams) {

    var params = removeLastSlash(routeParams).split('/');

    return params;
}

module.exports = getExpressParams;
