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

app.controller('particlesController', function($scope, $firebaseObject, _) {

    var ref = new Firebase("https://amber-heat-6552.firebaseio.com/particle-io/0bb951aa-985e-453a-bab4-b2dca6f5b50d/particles");
    var fbData = [];

    $scope.user = {
        email: 'ajjoh5@gmail.com',
        password: 'jabronie'
    };
    $scope.particles = [];

    ref.authWithPassword($scope.user, function(authData) {
        console.log('finished auth: ' + authData);
    });

    function getLatestParticles(isReverse) {

        ref.on("value", function(data) {

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

            $scope.particles = particles;
        });

        //hook up event now to listen for only datas loaded
        ref.limitToLast(1).on('child_added', function(data, prevChild) {
            // all records after the last continue to invoke this function
            console.log(data.key(), data.val());
        });

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