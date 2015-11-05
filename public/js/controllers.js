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


ctrls.controller('Reports', function($scope, $http) {

    var svg1 = dimple.newSvg('#chart', 800, 450);
    var svg2 = dimple.newSvg('#chart', 800, 450);

    $http.get('/api/30-day-report/').success(function(data) {

        // Create and Position a Chart
        var myChart = new dimple.chart(svg1, data);
        myChart.setBounds(50, 30, 700, 300);

        var x = myChart.addCategoryAxis('x', 'Date');
        var y = myChart.addMeasureAxis('y', 'Total');

        // Order the x axis by date
        x.addOrderRule('Date');

        // Min price will be green, middle price yellow and max red
        myChart.addColorAxis('Items', ['red', 'yellow', 'green']);

        // Add a thick line with markers
        var lines = myChart.addSeries(null, dimple.plot.line);
        lines.lineWeight = 4;
        lines.lineMarkers = true;

        // Draw the chart
        myChart.draw();

        svg1.append("text")
           .attr("x", myChart._xPixels() + myChart._widthPixels() / 2)
           .attr("y", myChart._yPixels() - 10)
           .style("text-anchor", "middle")
           .style("font-family", "sans-serif")
           .style("font-weight", "bold")
           .text("Income Over 30 Days");
    });

    $http.get('/api/year-report/').success(function(data) {

        // Create and Position a Chart
        var myChart = new dimple.chart(svg2, data);
        myChart.setBounds(50, 30, 700, 300);

        var x = myChart.addCategoryAxis('x', 'Month');
        var y = myChart.addMeasureAxis('y', 'Total');
        y.overrideMin = 2400;

        // Min price will be green, middle price yellow and max red
        myChart.addColorAxis('Total', ['red', 'yellow', 'green']);

        var lines = myChart.addSeries(null, dimple.plot.line);
        lines.lineWeight = 4;
        lines.lineMarkers = true;

        // Draw the chart
        myChart.draw();

        svg2.append("text")
           .attr("x", myChart._xPixels() + myChart._widthPixels() / 2)
           .attr("y", myChart._yPixels() - 10)
           .style("text-anchor", "middle")
           .style("font-family", "sans-serif")
           .style("font-weight", "bold")
           .text("Income Over Year");
    });
});

