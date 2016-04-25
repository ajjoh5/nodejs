var app = angular.module('appLogin', ['firebase']);

app.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

app.controller('loginController', function($scope, $window, $firebaseArray) {

    var ref = new Firebase("https://amber-heat-6552.firebaseio.com/particle-io/rbluff");
    var fbData = [];
    $scope.user = {};

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
            window.location.href = '/particles/';

        } else {
            console.log("User is logged out");
            $window.location.href = '/login';
        }
    });
});