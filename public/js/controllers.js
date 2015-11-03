'use strict';
/* jslint browser: true */
/* global angular:false, _:false, $:flase */

var ctrls = angular.module('app.controllers', ['ngResource', 'ngRoute']);

ctrls.controller('main', function($scope, $location, $http) {
    $http.get('/api/products/').success(function(data) {
        $scope.products = data;
    });

    $scope.go = function(view) {
        $location.path(view);
    };
});


ctrls.controller('Products', function($scope, $http) {
    $scope.edit = function(id) {
        $scope.go('/product/'+id);

        // var p = _.clone($scope.products[id]);
        // delete p._id;

        // $http.post('/api/products/', p).success(function(data) {
        //     console.log(data);
        // });
    };
});

ctrls.controller('Product', function($scope, $routeParams, $http) {
    var id = $routeParams.id;

    $scope.product = _.clone($scope.products[id]);

    $scope.update = function() {
        $http.put('/api/products/'+ id, $scope.product).success(function(res) {
            if (res.status === 'updated') {
                $scope.products[id] = res.product;
                $scope.go('/products/');
            }
        });
    };

    $scope.delete = function() {
        $http.delete('/api/products/'+ id).success(function(res) {
            console.log(res);

            if (res.status === 'removed') {
                delete $scope.products[id];
                $scope.go('/products/');
            }
        });
    };
});
