'use strict';

angular.module('demoApp')
  .controller('MainCtrl', function ($scope) {
    $scope.removeThing = function(thing){
      $scope.things.splice($scope.things.indexOf(thing), 1);
    };
    $scope.things = [{name: 1},{name: 2},{name: 3},{name: 4},{name: 5}];
  });
