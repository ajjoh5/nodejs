angular.module('app', ['ngRoute', 'ngAnimate', 'app.controllers'])

.config(function($routeProvider, $locationProvider) {

    $routeProvider

        // route for the home page
        .when('/pages/home', {templateUrl : 'pages/home.html', controller  : 'homeController' })
        .when('/pages/about-me', {templateUrl : 'pages/home.html', controller  : 'homeController' })

        // route for the about page
        .when('/pages/contact-me', {templateUrl : 'pages/contact-me.html', controller  : 'contactController' })

        // route for the wow page page
        .when('/wow/:id', {templateUrl : 'pages/about.html', controller  : 'aboutController' })

        .otherwise({redirectTo: '/pages/about-me'});

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
    $scope.title = 'About Me'
    $scope.message = 'Adam Johnstone';

})

.controller('contactController', function($scope, $http, $timeout) {
        $scope.title = 'Contact Me'
        $scope.message = 'Adam Johnstone';
        $scope.formData = {};
        $scope.sendEmailStatus = 0;

        $scope.submitContact = function()
        {
            $scope.sendEmailStatus = 1;

            $http({
                method  : 'POST',
                url     : '/mail/send',
                data    : $.param($scope.formData),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            })
            .success(function(data) {
                console.log('Successfully sent email: ' + angular.toJson(data));

                //if data that came back contains 'id' then this was successful
                if(data.id)
                {
                    $scope.sendEmailStatus = 2;
                    $timeout(function(){
                        $scope.formData = {};
                        $scope.sendEmailStatus = 0;
                    }, 1000);
                }
            })
            .error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log('Error occurred.');
                $scope.sendEmailStatus = 2;
                $timeout(function(){
                    $scope.sendEmailStatus = 0;
                }, 1000);
            });
        };
})

.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});


//curl -s --user 'api:key-74bcec52b1dd582c2989aec6022ce95d' \
//https://api.mailgun.net/v3/sandbox65ed4cdf4db643d2bf73f1bb9ee348c4.mailgun.org/messages \
//    -F from='Mailgun Sandbox <postmaster@sandbox65ed4cdf4db643d2bf73f1bb9ee348c4.mailgun.org>' \
//-F to='Adam Johnstone <ajjoh5@gmail.com>'\
//-F subject='Hello Adam Johnstone' \
//-F text='Congratulations Adam Johnstone, you just sent an email with Mailgun!  You are truly awesome!

//You can see a record of this email in your logs: https://mailgun.com/cp/log
// You can send up to 300 emails/day from this sandbox server. Next, you should add your own domain so you can send 10,000 emails/month for free.'
