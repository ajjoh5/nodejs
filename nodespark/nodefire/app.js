angular.module('app', ['ngRoute', 'app.controllers'])

.config(function($routeProvider) {

    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : 'pages/home.html',
            controller  : 'homeController'
        })

        // route for the about page
        .when('/about', {
            templateUrl : '/pages/about.html',
            controller  : 'aboutController'
        })

        // route for the contact page
        .when('/contact', {
            templateUrl : '/pages/contact.html',
            controller  : 'contactController'
        });
});

angular.module('app.controllers', [])

.controller('homeController', function($scope) {

    $scope.message = 'NodeFire.io';

})

.controller('aboutController', function($scope) {
    // create a message to display in our view
    $scope.message = 'about ctrl...';
})

.controller('contactController', function($scope) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
    $scope.contactMessage = "This is a contact message";
});
