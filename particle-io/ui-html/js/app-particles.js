var app = angular.module('appParticles', ['ngRoute', 'firebase', 'underscore']);

var underscore = angular.module('underscore', []);
underscore.factory('_', ['$window', function($window) {
    return $window._; // assumes underscore has already been loaded on the page
}]);

app.config(['$routeProvider',
function($routeProvider) {
    $routeProvider.
    when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'particlesController'
    }).
    // when('/phones/:phoneId', {
    //     templateUrl: 'partials/phone-detail.html',
    //     controller: 'PhoneDetailCtrl'
    // }).
    otherwise({
        redirectTo: '/home'
    });
}]);


app.filter('typeFilter', function() {
    return function(items, selectedType) {

        var filtered = [];

        if(!selectedType || selectedType == '' || selectedType == '_total') {
            filtered = items;
            return filtered;
        }

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.__type == selectedType) {
                filtered.push(item);
            }
        }
        return filtered;
    }
});

app.filter('groupFilter', function() {
    return function(items, selectedGroup) {

        var filtered = [];

        if(!selectedGroup || selectedGroup == '' || selectedGroup == '_total') {
            filtered = items;
            return filtered;
        }

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.__group == selectedGroup) {
                filtered.push(item);
            }
        }
        return filtered;
    }
});

app.controller('particlesController', function($scope, $location, $firebaseObject, _) {

    var ref = new Firebase("https://amber-heat-6552.firebaseio.com/particle-io/0bb951aa-985e-453a-bab4-b2dca6f5b50d/particles");
    var fbData = [];

    $scope.user = {
        email: 'ajjoh5@gmail.com',
        password: 'jabronie'
    };
    $scope.particles = [];

    $scope.hdReportRange = '';
    $scope.totalTypeData = {};
    $scope.totalGroupData = {};
    $scope.selectedType = '_total';
    $scope.selectedGroup = '_total';
    $scope.searchText = '';

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

    //Start firebase auth process
    var authData = ref.getAuth();
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
            getLatestParticles(true);

        } else {
            console.log("User is logged out");
        }
    });

    $scope.updateReport = function() {
        getLatestParticles(true);
    };

    $scope.filterTypeBy = function(key) {
        $scope.selectedType = key;
    };

    $scope.filterGroupBy = function(key) {
        $scope.selectedGroup = key;
    };

    function monitorNewRow(data, prevChild) {
        // all records after the last continue to invoke this function
        //console.log(data.key(), data.val());

        var newRow = data.val();

        var startDate = parseInt(localStorage['reportStartUTC']);
        var endDate = parseInt(localStorage['reportEndUTC']);

        if (newRow.__createdutc) {
            if (startDate <= newRow.__createdutc && endDate >= newRow.__createdutc) {

                //If we are within the date ranges of the new records "created date" then
                //add it to the array and update the counts.
                //Otherwise, ignore, because we are looking at historical or future non existant data

                var particles = $scope.particles;
                particles.splice(0,0,data.val());

                var countTypeData = _.countBy(particles, function(item){
                    return item['__type'];
                });
                countTypeData._total = particles.length;
                $scope.totalTypeData = countTypeData;

                var countGroupData = _.countBy(particles, function(item){
                    return item['__group'];
                });
                countGroupData._total = particles.length;
                $scope.totalGroupData = countGroupData;
            }
        }


    };

    function getLatestParticles(isReverse) {

        //console.log('getLatestParticles');

        var startDate = parseInt(localStorage['reportStartUTC']);
        var endDate = parseInt(localStorage['reportEndUTC']);
        var groupCounts = {};

        //ref.orderByChild("__createdutc").startAt(1462600000000).endAt(1462699540988).on("value", function(data) {
        ref.orderByChild("__createdutc").startAt(startDate).endAt(endDate).once("value", function(data) {

            var particles = [];
            if(isReverse) {
                //Map firebase objects to an array
                particles = _.map(data.val(), function(value, key) {
                    return value;
                }).reverse();
            }
            else {
                //Map firebase objects to an array
                particles = _.map(data.val(), function(value, key) {
                    return value;
                });
            }

            var countTypeData = _.countBy(particles, function(item){
                return item['__type'];
            });
            countTypeData._total = particles.length;
            $scope.totalTypeData = countTypeData;

            var countGroupData = _.countBy(particles, function(item){
                return item['__group'];
            });
            countGroupData._total = particles.length;
            $scope.totalGroupData = countGroupData;

            $scope.particles = particles;
        });

        ref.off('child_added', monitorNewRow);

        //hook up event now to listen for only datas loaded
        ref.limitToLast(1).on('child_added', monitorNewRow);

        $firebaseObject(ref);
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

    $scope.test = 'Adamj';

    $scope.addParticle = function() {
        console.log('Add Particle');

        $scope.particles.$add({
            particle : {
                message : "Just added me!!"
            }
        });
    };
});

// app.controller('particlesController', function($scope, $window, $firebaseArray) {
//
//     var ref = new Firebase("https://amber-heat-6552.firebaseio.com/particle-io/bbdddda9-723e-49eb-9639-8545003c237c/particles");
//     var fbData = [];
//     $scope.user = {};
//     $scope.particles = [];
//
//     $scope.login = function() {
//         console.log('Login user');
//         console.log($scope.user);
//
//         //Authenticate with AngularJS
//         ref.authWithPassword($scope.user, function(authData) {
//             console.log('finished auth');
//         });
//     };
//
//     $scope.logout = function() {
//         ref.unauth();
//     };
//
//     //On auth (success or fail) get records
//     ref.onAuth(function(authData) {
//         if (authData) {
//             console.log("User " + authData.uid + " is logged in with " + authData.provider);
//             //console.log(authData);
//             $scope.particles = $firebaseArray(ref);
//
//         } else {
//             console.log("User is logged out");
//         }
//     });
//
//     $scope.test = 'Adamj';
//
//     $scope.addParticle = function() {
//         console.log('Add Particle');
//
//         $scope.particles.$add({
//             particle : {
//                 message : "Just added me!!"
//             }
//         });
//     };
// });