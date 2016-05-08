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

    ref.authWithPassword($scope.user, function(authData) {
        console.log('finished auth: ' + authData);
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

    function getLatestParticles(isReverse) {

        //console.log('getLatestParticles');

        var startDate = parseInt(localStorage['reportStartUTC']);
        var endDate = parseInt(localStorage['reportEndUTC']);
        var groupCounts = {};

        //ref.orderByChild("__createdutc").startAt(1462600000000).endAt(1462699540988).on("value", function(data) {
        ref.orderByChild("__createdutc").startAt(startDate).endAt(endDate).on("value", function(data) {

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

        //hook up event now to listen for only datas loaded
        // ref.limitToLast(1).on('child_added', function(data, prevChild) {
        //     // all records after the last continue to invoke this function
        //     console.log(data.key(), data.val());
        // });

        // var zCount = 0;
        //
        // ref.on('child_added', function(data, prevChild) {
        //
        //     var itemData = data.val();
        //
        //
        //     //delete all utc dates
        //
        //     // if(itemData.__createdutc) {
        //     //     zCount++;
        //     //     console.log(zCount);
        //     //
        //     //     delete itemData.__createdutc;
        //     //
        //     //     var itemRef = ref.child(data.key());
        //     //     var path = itemRef.toString();
        //     //     console.log(path);
        //     //
        //     //     itemRef.set(itemData);
        //     // }
        //
        //
        //     //Update the UTC date
        //     // if(!itemData.__createdutc) {
        //     //     zCount++;
        //     //     console.log(zCount);
        //     //
        //     //     var stringDate = itemData.__created;
        //     //     var t = stringDate.split('-');
        //     //
        //     //     var newStringDate = t[1] + '-' + t[0] + '-' + t[2];
        //     //
        //     //     var d = Date.parse(newStringDate);
        //     //     itemData.__createdutc = d + 36000000;
        //     //
        //     //     var itemRef = ref.child(data.key());
        //     //     var path = itemRef.toString();
        //     //     console.log(path);
        //     //
        //     //     itemRef.set(itemData);
        //     //
        //     // }
        // });

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

    //On auth (success or fail) get records
    ref.onAuth(function(authData) {
        if (authData) {
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
            getLatestParticles(true);

        } else {
            console.log("User is logged out");
        }
    });

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