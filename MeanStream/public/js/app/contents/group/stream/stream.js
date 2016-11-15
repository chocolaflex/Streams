'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StreamCtrl = function () {
    function StreamCtrl($socket, $http, groupService) {
        _classCallCheck(this, StreamCtrl);

        StreamCtrl.$injecter = ['$socket', '$http', 'groupService'];
        this.$socket = $socket;
        this.$http = $http;
        this.groupService = groupService;
        this.group = this.groupService.get();
    }

    _createClass(StreamCtrl, [{
        key: '$routerOnActivate',
        value: function $routerOnActivate(next) {
            var _this = this;

            this.id = next.params.id;
            this.$http.get('api/groups/' + this.group.id + '/streams/' + this.id).then(function (res) {
                _this.stream = res.data;
                //this.$parent.title = data.title;
                //this.count = data.count;
                if (_this.stream.access) {
                    _this.$socket.emit('req_join', {
                        group: _this.group.id,
                        stream: _this.stream.id
                    });
                    _this.$socket.on('connected', function (json) {
                        _this.response = function () {
                            _this.$socket.emit('c2s_message', {
                                message: _this.res.message
                            });
                        };
                    });
                }
            }, function (error) {});
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