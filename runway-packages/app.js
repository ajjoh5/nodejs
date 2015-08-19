var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
    return window._; //Underscore must already be loaded on the page
});

angular.module('app', ['ngRoute', 'underscore', 'app.controllers'])

    .config(function($routeProvider, $locationProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'pages/home_2.html',
                controller  : 'homeController'
            });

            //.otherwise({redirectTo: '/'});

            //$locationProvider.html5Mode(true);
    });


angular.module('app.controllers', [])

    .controller('homeController', function($scope, $http, $window, _) {

        $scope.mpData = [];
        $scope.mpCityList = [];
        $scope.mpRegionList = [];
        $scope.firstRow = {};
        $scope.title = 'Browse House and Land Packages';
        $scope.regionPackagesOpen = {};

        $scope.openPDF = function(url) {
            $window.open(url);
        };

        $scope.openPackage = function(region, showPackages) {
            //If region does not exist yet - create the field.
            if(!$scope.regionPackagesOpen[region]) { $scope.regionPackagesOpen[region] = 0; }

            if(showPackages) {
                $scope.regionPackagesOpen[region]++;
            }
            else {
                $scope.regionPackagesOpen[region]--;
            }
        };

        $scope.getGUID = function()
        {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        };

        $scope.getCompiledPackages = function()
        {
            //alert('Getting compiled json');
            $http.get('jsonfiles/MainVue VIC-cache.json').
                success(function (cPackages) {
                    _.each(cPackages, function(item) {

                        //Find if region is currently not in the list
                        var regionItem = _.find($scope.mpRegionList, function(rItem) {
                            return rItem.Region === item.Region;
                        });

                        //If region is not in list - add it!
                        if(!regionItem) {
                            regionItem = {
                                id : $scope.getGUID(),
                                Region: item.Region,
                                EstateList : []
                            };

                            $scope.mpRegionList.push(regionItem);
                        }

                        var estateItem = _.find(regionItem.EstateList, function(eItem) {
                            return eItem.Estate === item.Estate;
                        });

                        if(!estateItem)
                        {
                            estateItem = {
                                id : $scope.getGUID(),
                                Estate: item.Estate,
                                City : item.City,
                                Counter : 0,
                                LowestPrice : 10000000,
                                Packages : []
                            };

                            regionItem.EstateList.push(estateItem);
                        }

                        estateItem.Packages.push(item);
                        estateItem.Counter++;

                        if(estateItem.LowestPrice > item.HomePrice)
                        {
                            estateItem.LowestPrice = item.HomePrice;
                        }
                    });

                    _.each($scope.mpRegionList, function(region) {

                        region.EstateList = _.sortBy(region.EstateList, 'City');

                        //_.each(region.EstateList, function(eItem) {
                        //    //console.log(eItem.Estate);
                        //    eItem.Packages = _.sortBy(eItem.Packages, 'Estate');
                        //});
                    });

                    $scope.mpData = JSON.stringify($scope.mpRegionList);
                }).
                error(function (sPackages, status, headers, config) {
                    alert('Error occurred retrieving "Search" Runway Packages cache');
                });
        };

        $scope.getRunwayPackages = function(){

            //Get Runway Packages
            $http.get('jsonfiles/packages3.json').
                success(function(rPackages) {

                    //Get Search Runway Packages
                    $http.get('jsonfiles/packages.json').
                        success(function(sPackages) {

                            _.each(rPackages, function(item)
                            {
                                if(item.Plan.Home.Range.Name == 'MainVue VIC'
                                    && item.Publishing.Status == 'Published')
                                {
                                    $scope.firstRow = angular.toJson(item);

                                    //Get the Home Package from "Search" Packages that matches the one in the "Default" packages
                                    var sHomePackage = _.find(sPackages, function(sItem) {
                                       return sItem.ProductID === item.PackageID;
                                    });

                                    var mPackage =  {
                                        PackageID : item.PackageID,
                                        City : '---',
                                        Region : item.Location.Parent.Name,
                                        Estate : item.Lot.Stage.Estate.Name,
                                        LotID : item.Lot.LotID,
                                        Lot : item.Lot.Name,
                                        LotWidth : sHomePackage.LotWidth ? sHomePackage.LotWidth : '',
                                        LotArea : sHomePackage.LotArea ? sHomePackage.LotArea : '',
                                        HomeID : item.Plan.Home.HomeID,
                                        Home : (item.Plan.Home.Name + ' ' + item.Plan.Name),
                                        HomeSize : '---',
                                        HomePrice : item.Price,
                                        HomeArea : sHomePackage.HomeArea ? sHomePackage.HomeArea : '',
                                        Storeys : sHomePackage.Storeys ? sHomePackage.Storeys : '',
                                        Bedrooms : sHomePackage.Bedrooms ? sHomePackage.Bedrooms : '',
                                        Bathrooms : sHomePackage.Bathrooms ? sHomePackage.Bathrooms : '',
                                        CarParks : sHomePackage.CarParks ? sHomePackage.CarParks : '',
                                        PDFFile : item.PropertyPDFURL
                                    };

                                    console.log('jsonfiles/' + item.PackageID + '.json');

                                    //Get Extended package information on package
                                    $http.get('jsonfiles/' + item.PackageID + '.json').
                                        success(function(extPackage) {

                                            var homeSize = _.find(extPackage.Plan.Details, function(eItem) {
                                                return eItem.DetailsType === 'House';
                                            });

                                            mPackage.City = extPackage.Address.City ? extPackage.Address.City : '---';
                                            mPackage.HomeSize = homeSize.Squares ? homeSize.Squares : '---';

                                            //Push Mainvue Package to Data
                                            $scope.mpData.push(mPackage);
                                        }).
                                        error(function(sPackages, status, headers, config) {
                                            console.log('No package file with PackageID: ' + item.PackageID);
                                            $scope.mpData.push(mPackage);
                                        });
                                }
                            });

                            $scope.mpData = _.sortBy($scope.mpData, 'Estate');
                            $scope.mpEstates = _.sortBy($scope.mpEstates);

                            //_.each($scope.mpData, function(item) {
                            //    console.log(item.EstateName + ' - ' + item.Name);
                            //})

                            //$scope.firstRow = angular.toJson($scope.mpData[0]);
                        }).
                        error(function(sPackages, status, headers, config) {
                            alert('Error occurred retrieving "Search" Runway Packages cache');
                        });
                }).
                error(function(rPackages, status, headers, config) {
                    alert('Error occurred retrieving "Default" Runway Packages cache');
                });
        };

        //$scope.getRunwayPackages();
        $scope.getCompiledPackages();
    })

    .directive('select2', function() {

        function link(scope, element, attr) {
            //alert('asdfdsaf');

            var opts = {
                minimumResultsForSearch: Infinity
            };

            $('select').select2(opts);

            element.on('load', function() {

            });
        }

        return {
            restrict: 'E',
            link: link
        };
    })

    .directive('nouislider', function () {

        function link(scope, element, attr) {

            var opts = {
                max : parseInt(element[0].attributes.max.value),
                min : parseInt(element[0].attributes.min.value),
                step : parseInt(element[0].attributes.step.value),
                id : element[0].attributes.id.value,
                formatBefore : element[0].attributes['format-before'].value,
                formatAfter : element[0].attributes['format-after'].value
            };

            console.log(opts);
            var handlesSlider = document.getElementById(opts.id);

            noUiSlider.create(handlesSlider, {
                start: [ opts.min, opts.max ],
                step: opts.step,
                connect: true,
                range: {
                    'min': opts.min,
                    'max': opts.max
                },
                format: {
                    to: function ( value ) {

                        value = "" + value;

                        var isThousand = 0;
                        var newValue = '';

                        for (var i=value.length; i >= 0; i--) {
                            if(isThousand == 4)
                            {
                                isThousand = 0;
                                newValue = ',' + newValue;
                            }
                            newValue = value.charAt(i) + newValue;
                            isThousand++
                        }

                        return opts.formatBefore + newValue + opts.formatAfter;
                    },
                    from: function ( value ) {

                        return value;
                    }
                }
            });

            var snapValues = [
                document.getElementById(opts.id + '-lower'),
                document.getElementById(opts.id + '-upper')
            ];

            handlesSlider.noUiSlider.on('update', function( values, handle ) {
                snapValues[handle].innerHTML = values[handle];
            });

            //element.on('load', function() {
            //    alert('slider loaded');
            //});
        }

        return {
            restrict: 'A',
            link: link
        };
    });
