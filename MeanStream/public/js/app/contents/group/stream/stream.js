'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StreamCtrl = function () {
    function StreamCtrl($socket, $http, streamService, params, $scope, toastr, ngAudio, $sce) {
        _classCallCheck(this, StreamCtrl);

        StreamCtrl.$inject = ['$socket', '$http', 'streamService', 'params', '$scope', 'toastr', 'ngAudio', '$sce'];
        this.$socket = $socket;
        this.$http = $http;
        this.streamService = streamService;
        this.params = params;
        this.$scope = $scope;
        this.toastr = toastr;
        this.$sce = $sce;
        //        this.se = ngAudio.load();
    }

    _createClass(StreamCtrl, [{
        key: '$routerOnActivate',
        value: function $routerOnActivate(next) {
            var _this = this;

            this.params.sid = next.params.sid;
            this.streamId = this.params.sid;
            this.groupId = this.params.gid;
            this.streamService(this.groupId, this.streamId).then(function (stream) {
                _this.stream = stream;
                _this.group = stream.group;
                if (_this.stream.access) {
                    _this.$socket.on('err_stream', function (message) {
                        _this.toastr.error(message);
                    });
                    _this.$socket.emit('req_join', {
                        group: _this.group.id,
                        stream: _this.stream.id
                    });
                    _this.$socket.on('connected', function (json) {
                        _this.response = function () {
                            _this.$socket.emit('c2s_message', {
                                group: _this.group.id,
                                stream: _this.stream.id,
                                message: _this.res.message
                            });
                            _this.res = {};
                        };
                        _this.$socket.on('s2c_message', function (message) {
                            _this.stream.responses.push(message);
                        });
                    });
                }
            }).catch(function (error) {});
        }
    }]);

    return StreamCtrl;
}();

app.component('streamCmp', {
    templateUrl: 'partials/group/stream.html',
    controller: StreamCtrl
});
app.factory('$socket', function ($rootScope, $auth) {
    var socket = io('localhost:8888', {
        query: 'Authorization=Bearer ' + $auth.getToken()
    });
    return {
        on: function on(event, callback) {
            socket.on(event, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function emit(event, data, callback) {
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