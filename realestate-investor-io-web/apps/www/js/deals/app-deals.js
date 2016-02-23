var underscore = angular.module('underscore', []);

underscore.factory('_', ['$window', function($window) {
    return $window._; // assumes underscore has already been loaded on the page
}]);

var app = angular.module('appDeals', ['underscore']);
app.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('dealsController', function($scope, $http, $window, _) {

    //Init variables
    $scope.listings = [];

    function GetListings() {

        //Get allocated jobs
        $http.get('/api/deals/vic/burwood/3125')
        .success(function(data, status, headers, config) {

            //get allocated jobs into scope
            var json = angular.fromJson(data);
            var listings = json.listings;
            var sortedListings = _.sortBy(listings, function(item) { return item.deals.cashflowAnnual }).reverse();
            $scope.listings = sortedListings;
        }).
        error(function(data, status, headers, config) {
            // log error
        });
    }

    function GetAllListings() {

        //Get allocated jobs
        $http.get('/api/all-deals/')
        .success(function(data, status, headers, config) {

            //get allocated jobs into scope
            var listings = angular.fromJson(data);
            var sortedListings = _.sortBy(listings, function(item) { return item.deals.cashflowAnnual }).reverse();
            $scope.listings = sortedListings;
        }).
        error(function(data, status, headers, config) {
            // log error
        });
    }

    $scope.getAddressShort = function(address, length) {
        var result = address;

        if(result.length > length) {
            result = address.substring(0, length) + '...';
        }

        return result;
    };

    $scope.openProperty = function(link) {
        $window.open(link);
    };

    GetAllListings();
});