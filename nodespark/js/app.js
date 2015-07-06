angular.module('app', ['ngRoute', 'app.controllers'])

.config(function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : '/pages/my-nodes.html',
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
    // create a message to display in our view
    $scope.message = 'io - Angular homepage message';

    // var jsonData =
    // {
    //     'Henley' : 'asdfklj128937',
    //     'Mainvue' : 'adsfk189273123',
    //     'Plantation' :
    //     {
    //         'About Us': 'value3.1',
    //         'History' : 'value3.2',
    //         'Products' :
    //         {
    //             Product_1 : 'value3.3.1',
    //             Product_2 : 'value3.3.2',
    //             Product_3 : 'value3.3.3',
    //             Product_4 : 'value3.3.4'
    //         }
    //     },
    //     'API EndPoints' :
    //     {
    //         'Get all Jobs' : 'value3.3.1'
    //     }
    // };

    var jsonData =
    {
        'Henley' : 'asdfklj128937',
        'Mainvue' : 'adsfk189273123',
        'Plantation' :
        {
            'About Us': 'value3.1',
            'History' : 'value3.2',
            'Products' :
            {
                Product_1 : 'value3.3.1',
                Product_2 : 'value3.3.2',
                Product_3 : 'value3.3.3',
                Product_4 : 'value3.3.4'
            }
        },
        'API EndPoints' :
        {
            'Get all Jobs' : 'value3.3.1'
        }
    };


    var jsonTree = [];

    function getTree(data, treeNode)
    {
        //Iterate through jsonData array (if it is an object)
        if(_.isObject(data))
        {
            _.each(data,function(value,key,field)
            {
                //console.log('key: ' + key + ', value: ' + value);
                if(_.isObject(value))
                {
                    //console.log(key);
                    var item = {
                        title : key,
                        value : '',
                        items : []
                    };

                    console.log(key + ' ' + value);
                    treeNode.push(item);
                    getTree(value, item.items);
                }
                else
                {
                    var item = {
                        title : key,
                        value : value,
                        items : []
                    };
                    console.log(key + ' ' + value);
                    treeNode.push(item);
                }
            });
        }
    }

    getTree(jsonData, jsonTree);

    $scope.jsonTreeS = angular.toJson(jsonTree, true);
    $scope.jsonTree = jsonTree;


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
