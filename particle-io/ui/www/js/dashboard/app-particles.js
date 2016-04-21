var app = angular.module('appParticles', ['firebase']);

app.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('particlesController', function($scope, $window, $firebaseArray) {

    var ref = new Firebase("https://amber-heat-6552.firebaseio.com/particles");
    var fbData = [];
    $scope.user = {};
    $scope.particles = [];

    $scope.login = function() {
        console.log('Login user');
        console.log($scope.user);

        //Authenticate with AngularJS
        ref.authWithPassword($scope.user, function(authData) {
            console.log('finished auth');
        });
    };

    $scope.logout = function() {
        ref.unauth();
    };

    //On auth (success or fail) get records
    ref.onAuth(function(authData) {
        if (authData) {
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
            $scope.particles = $firebaseArray(ref);

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