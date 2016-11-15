'use strict'
angular.module('app')
    .controller('HomeCtrl', ['$scope', function ($scope) {
        $scope.$parent.title = 'Streams - ホーム';
    }]);