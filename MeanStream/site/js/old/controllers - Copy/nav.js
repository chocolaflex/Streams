'use strict';

angular.module('app')
    .controller('NavCtrl', ['$scope', '$auth', function ($scope, $auth) {
        $scope.isAuthenticated = function () {
            return $auth.isAuthenticated();
        };
    }]);