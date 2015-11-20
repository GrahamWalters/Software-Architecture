'use strict';
/* jslint browser: true */
/* global angular:false */

var app = angular.module('SA', [
    'app.controllers'
]);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/products', {controller: 'Products', templateUrl:'views/products.html'})
    .when('/products/new/', {controller: 'ProductNew', templateUrl:'views/product-new.html'})
    .when('/products/:id/', {controller: 'Product', templateUrl:'views/product-edit.html'})
    .when('/reports', {controller: 'Reports', templateUrl:'views/reports.html'})
    .otherwise({redirectTo: '/products'});
});

app.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
        var filtered = [];

        angular.forEach(items, function(item) {
            filtered.push(item);
        });

        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });

        if (reverse) filtered.reverse();

        return filtered;
    };
});
