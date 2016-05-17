var app = angular.module('appParticles', ['ngRoute', 'firebase', 'underscore']);

var underscore = angular.module('underscore', []);
underscore.factory('_', ['$window', function($window) {
    return $window._; // assumes underscore has already been loaded on the page
}]);

app.config(['$routeProvider',
function($routeProvider) {
    $routeProvider.
    when('/home', {
        templateUrl: 'partials/home-v2.html',
        controller: 'particlesController'
    }).
    otherwise({
        redirectTo: '/home'
    });
}]);


// app.filter('typeFilter', function() {
//     return function(items, selectedType) {
//         var filtered = [];
//
//         if(!selectedType || selectedType == '' || selectedType == '_total') {
//             filtered = items;
//             return filtered;
//         }
//
//         for (var i = 0; i < items.length; i++) {
//             var item = items[i];
//             if (item.__type == selectedType) {
//                 filtered.push(item);
//             }
//         }
//         return filtered;
//     }
// });
//
// app.filter('groupFilter', function() {
//     return function(items, selectedGroup) {
//         var filtered = [];
//
//         if(!selectedGroup || selectedGroup == '' || selectedGroup == '_total') {
//             filtered = items;
//             return filtered;
//         }
//
//         for (var i = 0; i < items.length; i++) {
//             var item = items[i];
//             if (item.__group == selectedGroup) {
//                 filtered.push(item);
//             }
//         }
//         return filtered;
//     }
// });

app.controller('particlesController', function($scope, $location, $firebaseObject, _) {
    var ref = new Firebase("https://amber-heat-6552.firebaseio.com/particle-io/0bb951aa-985e-453a-bab4-b2dca6f5b50d/particles");
    var authData = {};

    $scope.user = {
        email: 'ajjoh5@gmail.com',
        password: 'jabronie'
    };

    var masterParticles = [];
    var lastParticles = [];
    $scope.particles = [];
    $scope.masterParticles = [];

    $scope.hdReportRange = '';
    $scope.totalTypeData = {};
    $scope.totalGroupData = {};
    $scope.selectedType = '_all';
    $scope.selectedGroup = 'error';
    $scope.searchText = '';
    $scope.limitAmount = 10;
    $scope.totalDisplayed = $scope.limitAmount;
    $scope.dataLoaded = false;
    $scope.dashboardLoaded = false;

    $scope.loadMore = function () {
        $scope.totalDisplayed += $scope.limitAmount;
        loadParticles();
    };

    var isAuthDataExpired = function() {
        var retval = false;
        //Get current epoch time, with no milliseconds (divide by 1000 to get this)
        //to make number the same format as firebase
        var currentTime = Math.floor(Date.now() / 1000);

        //Check if token is expired (or about to expire in 10 seconds.. hence the 10)
        if(authData && authData.expires < (currentTime + 10)) {
            retval = true;
        }

        return retval;
    };

    function initAuth() {
        //var ref = new Firebase("https://amber-heat-6552.firebaseio.com/particle-io/0bb951aa-985e-453a-bab4-b2dca6f5b50d/particles");

        //Start firebase auth process
        authData = ref.getAuth();
        if(isAuthDataExpired()) {
            authData = null;
        }

        if (authData) {
            console.log("ALREADY LOGGED IN - User " + authData.uid + " is logged in with " + authData.provider);
        }
        else {
            ref.authWithPassword($scope.user, function(authData) {
                console.log('finished auth: ' + authData);
            });
        }

        //On auth (success or fail) get records
        ref.onAuth(function(authData) {
            if (authData) {
                console.log("User " + authData.uid + " is logged in with " + authData.provider);
                initParticles();

            } else {
                console.log("User is logged out");
            }
        });
    }

    initAuth();

    $scope.updateReport = function() {
        getLatestParticles(true);
    };

    $scope.filterTypeBy = function(key) {
        console.log('filter type by: ' + key);
        //$scope.totalDisplayed = $scope.limitAmount;
        $scope.selectedType = key;
        //console.log(masterParticles);
        filterTypeParticles();
    };

    $scope.filterGroupBy = function(key) {
        console.log('filter group by: ' + key);
        //$scope.totalDisplayed = $scope.limitAmount;
        $scope.selectedGroup = key;
    };

    function filterTypeParticles() {

        var filtered = [];

        if($scope.selectedType == '_all') {
            filtered = masterParticles;
        }
        else {
            filtered = _.filter(masterParticles, function(item) {
                return item.__type == $scope.selectedType;
            });
        }

        $scope.particles = filtered;
    }

    function fbInitParticles(data) {

        var obj = data.val();
        masterParticles.splice(0,0,obj);

        if($scope.selectedType) {
            if($scope.selectedType == '_all' || $scope.selectedType == obj.__type) {
                lastParticles.splice(0,0,obj);
                console.log('fbInitParticles()');
            }
        }

        if(masterParticles.length >= $scope.limitAmount && !$scope.dataLoaded) {

            $scope.dataLoaded = true;
            $scope.particles = lastParticles;

            //apply new scope
            $scope.$apply();

            //time how long operation took
            ref.off('child_added', fbInitParticles);

            //Monitor all new rows
            ref.off('child_added', fbMonitorNewRow);
            ref.limitToLast(1).on('child_added', fbMonitorNewRow);

            console.timeEnd('fbInitParticles()');
        }
    }

    function fbLoadParticles(data) {

        var obj = data.val();
        masterParticles.splice(0,0,obj);

        if($scope.selectedType) {
            if($scope.selectedType == '_all' || $scope.selectedType == obj.__type) {
                lastParticles.splice(0,0,obj);
                console.log('fbLoadParticles()');
            }
        }

        if(masterParticles.length >= $scope.totalDisplayed) {

            $scope.particles = lastParticles;

            //apply new scope
            $scope.$apply();

            //time how long operation took
            ref.off('child_added', fbLoadParticles);
            console.timeEnd('fbLoadParticles()');
        }
    }

    function fbMonitorNewRow(data, prevChild) {
        // all records after the last continue to invoke this function
        //console.log(data.key(), data.val());

        var obj = data.val();

        var startDate = parseInt(localStorage['reportStartUTC']);
        var endDate = parseInt(localStorage['reportEndUTC']);

        if (obj.__createdutc) {
            if (startDate <= obj.__createdutc && endDate >= obj.__createdutc) {

                //If we are within the date ranges of the new records "created date" then
                //add it to the array and update the counts.
                //Otherwise, ignore, because we are looking at historical or future non existant data

                masterParticles.splice(0,0,obj);
                $scope.totalDisplayed++;

                //Add particle to display only if if matches the type we are watching (i.e error, total, info, etc)
                if($scope.selectedType) {
                    if($scope.selectedType == '_all' || $scope.selectedType == obj.__type) {
                        lastParticles.splice(0,0,obj);
                        console.log('fbMonitorNewRow()');
                    }
                }

                $scope.$apply();
            }
        }


    }

    // function addMasterParticle(data) {
    //
    //     masterParticles = _.map(data.val(), function(value, key) {
    //         return value;
    //     });
    //
    //     var countTypeData = _.countBy(masterParticles, function(item){
    //         return item['__type'];
    //     });
    //     countTypeData._total = masterParticles.length;
    //     $scope.totalTypeData = countTypeData;
    //
    //     var countGroupData = _.countBy(masterParticles, function(item){
    //         return item['__group'];
    //     });
    //     countGroupData._total = masterParticles.length;
    //     $scope.totalGroupData = countGroupData;
    //
    //     $scope.dashboardLoaded = true;
    //     $scope.masterParticles = masterParticles;
    //
    //     //apply new scope
    //     $scope.$apply();
    //
    //     console.timeEnd('addMasterParticle()');
    // }

    function initParticles() {

        //var ref = new Firebase("https://amber-heat-6552.firebaseio.com/particle-io/0bb951aa-985e-453a-bab4-b2dca6f5b50d/particles");

        var startDate = parseInt(localStorage['reportStartUTC']);
        var endDate = parseInt(localStorage['reportEndUTC']);

        console.time('fbInitParticles()');
        ref.orderByChild("__createdutc").startAt(startDate).endAt(endDate).limitToLast($scope.limitAmount).on("child_added", fbInitParticles);

        $scope.totalTypeData = { _all: '-', info : '-', error: '-', warning: '-' };
        $scope.dashboardLoaded = true;
    }

    function loadParticles() {

        //var ref = new Firebase("https://amber-heat-6552.firebaseio.com/particle-io/0bb951aa-985e-453a-bab4-b2dca6f5b50d/particles");

        lastParticles = [];

        var startDate = parseInt(localStorage['reportStartUTC']);
        var endDate = parseInt(localStorage['reportEndUTC']);

        console.time('fbLoadParticles()');
        ref.orderByChild("__createdutc").startAt(startDate).endAt(endDate).limitToLast($scope.totalDisplayed).on("child_added", fbLoadParticles);
        //ref.off('child_added', applyLatestParticles);

        // console.time('addMasterParticle()');
        // ref.orderByChild("__createdutc").startAt(startDate).endAt(endDate).once("value", addMasterParticle);

    }

    // $scope.login = function() {
    //     console.log('Login user');
    //     console.log($scope.user);
    //
    //     //Authenticate with AngularJS
    //     ref.authWithPassword($scope.user, function(authData) {
    //         console.log('finished auth');
    //     });
    // };
    //
    // $scope.logout = function() {
    //     ref.unauth();
    // };

});