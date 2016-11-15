var myApp = angular.module('app');

myApp.factory('$socket', function ($rootScope) {
    var socket = io.connect("localhost:8888");
    return {
        on: function (event, callback) {
            socket.on(event, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (event, data, callback) {
            socket.emit(event, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
});

myApp.controller('StreamCtrl', ['$scope', '$routeParams', '$socket', function ($scope, $routeParams, $socket) {
    $http.jsonp('api/streams/' + $routeParams.id,
        {
            params:
            {
                callback: 'JSON_CALLBACK'
            }
        })
        .success(function (data) {
            $scope.$parent.title = data.title;
            if (data.access) {
                $socket.emit("req_join", {
                    id: $routeParams.id
                });
                $socket.on("connected", function (json) {
                    var data = JSON.parse(json);
                    var stream
                    $scope.notice = data.id + "に接続しました";
                });
                $socket.on("err_stream", function (msg) {
                    $scope.notice = msg;
                });
                $socket.on("disconnect", function () { });
                $socket.on("s2c_message", function (data) { });

            }
        })
        .error(function (err) {

        });
}]);