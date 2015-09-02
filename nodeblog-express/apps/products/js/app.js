angular.module('app', ['ngRoute', 'ngAnimate', 'app.controllers'])

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

.controller('shopController', function($scope) {

    $scope.products = [{
            slug: 'book-multipage-angular-apps-in-nodjs',
            featuredImage : 'http://www.tcgen.com/wp-content/uploads/2013/03/book-shadow-2.png',
            title: 'Multi-Page Angular Apps in NodeJS',
            author: 'Adam Johnstone',
            publishDate: '11-04-2015',
            readMore: 'Innovation of products is something that does blah and more blah. Innovation of products is something that does blah and more blah. Innovation of products is something that does blah and more blah. Innovation of products is something that does blah and more blah. Innovation of products is something that does blah and more blah.',
            blog: 'This is the start of something'
        },
        {
            slug: 'lean-startup',
            featuredImage : 'http://www.inc.com/uploaded_files/image/feature-57-the-lean-startup-book-pop_10909.jpg',
            title: 'Choose the Lean Startup as your Architecture',
            author: 'Adam Johnstone',
            publishDate: '11-08-2015 5:15pm',
            readMore: 'What an amazing 6 months its been, moving from single page apps into a multi page tiered architecture. Reading the lean startup really helped me see what I wanted to do more clearly, as it opened up the possibility that we can work on multiple applications all at one time.',
            blog: 'This is the start of something'
        }];

})

.controller('productController', function($scope, $http, $timeout) {
    $scope.title = 'Contact Me'
    $scope.message = 'Adam Johnstone';
});