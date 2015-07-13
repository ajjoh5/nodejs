angular.module('app', ['ngRoute', 'ngAnimate', 'app.controllers'])

.config(function($routeProvider, $locationProvider) {

    $routeProvider

        // route for the home page
        .when('/blog/', {templateUrl : 'pages/home.html', controller  : 'homeController' })
        .when('/blog/:article', {templateUrl : 'pages/article.html', controller  : 'articleController' })

        .otherwise({redirectTo: '/blog/'});

    $locationProvider.html5Mode(true);
})

.animation('.view-slide-in', function () {

    return {
        enter: function(element, done) {
            element.css({
                opacity: 0,
                position: "relative",
                top: "0px",
                left: "0px"
            })
            .animate({
                top: 20,
                left: 0,
                opacity: 1
            }, 800, done);
        }
    }
});

angular.module('app.controllers', [])

.controller('homeController', function($scope) {
    $scope.title = 'Blog'
    $scope.message = 'Adam Johnstone';

})

.controller('articleController', function($scope, $http, $timeout) {
    $scope.title = 'Contact Me'
    $scope.message = 'Adam Johnstone';
});