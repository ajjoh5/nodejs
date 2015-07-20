angular.module('app', ['ngRoute', 'ngAnimate', 'app.controllers'])

//    .config(['$interpolateProvider', function ($interpolateProvider) {
//    $interpolateProvider.startSymbol('[[');
//    $interpolateProvider.endSymbol(']]');
//}])

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

.controller('blogController', function($scope, $http, $timeout) {

    $scope.blogs = [{
        slug: 'multiple-single-page-applications-in-nodejs',
        featuredImage : 'http://greenconcepts.com.au/wp-content/uploads/2012/08/featured-11.jpg',
        title: 'Multiple Single Page Applications, in one NodeJS application',
        author: 'Adam Johnstone',
        publishDate: 'Yesterday 1:00pm',
        readMore: 'What an amazing 6 months its been',
        blog: 'This is the start of something'
    },
    {
        slug: 'important-to-choose-right-architecture',
        featuredImage : 'http://www.visitnsw.com/nsw-tales/wp-content/uploads/2013/10/A-Heavenly-Aura-Cows-in-the-Hawkesbury-Image-Credit-Rhys-Pope2-380x210.jpg',
        title: 'Why is it important to choose the right Architecture',
        author: 'Adam Johnstone',
        publishDate: '11-08-2015 5:15pm',
        readMore: 'What an amazing 6 months its been',
        blog: 'This is the start of something'
    }];
});