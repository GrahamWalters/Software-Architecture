'use strict';
/* jslint browser: true */
/* global angular:false */

var app = angular.module('SA', [
    'app.controllers'
]);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/products', {controller: 'Products', templateUrl:'views/products.html'})
    .when('/product/:id/', {controller: 'Product', templateUrl:'views/product-edit.html'})
    .when('/reports', {controller: 'Reports', templateUrl:'views/reports.html'})
    .otherwise({redirectTo: '/products'});
});
