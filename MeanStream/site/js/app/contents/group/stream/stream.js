class StreamCtrl {
    constructor($socket,$http,streamService,params,$scope,toastr,ngAudio) {
        StreamCtrl.$inject = ['$socket','$http','streamService','params','$scope','toastr','ngAudio'];
        this.$socket = $socket;
        this.$http = $http;
        this.streamService = streamService;
        this.params = params;
        this.$scope = $scope;
        this.toastr = toastr;
        this.se = ngAudio.load();
    }
    $routerOnActivate(next) {
        this.params.sid = next.params.sid;
        this.streamId = this.params.sid;
        this.groupId = this.params.gid;
        this.streamService(this.groupId,this.streamId)
            .then((stream) => {
                this.stream = stream;
                this.group = stream.group;
                if (this.stream.access) {
                    this.$socket.on('err_stream', (message)=>{
                        this.toastr.error(message);
                    });
                    this.$socket.emit('req_join', {
                        group: this.group.id,
                        stream: this.stream.id,
                    });
                    this.$socket.on('connected', (json) => {
                        this.response = () => {
                            this.$socket.emit('c2s_message', {
                                group: this.group.id,
                                stream: this.stream.id,
                                message : this.res.message
                            });
                            this.res = {};
                        }
                        this.$socket.on('s2c_message', (message) => {
                            this.stream.responses.push(message);
                        });
                    });
                }
            })
            .catch((error) => {

            });
    }
}
app.component('streamCmp', {
    templateUrl: 'partials/group/stream.html',
    controller: StreamCtrl
});
app.factory('$socket', ($rootScope,$auth) => {
    let socket = io('localhost:8888', {
        query: 'Authorization=Bearer '+ $auth.getToken()
    });
    return {
        on: (event,callback) => {
            socket.on(event, function() {
                var args = arguments;
                $rootScope.$apply(() => {
                    callback.apply(socket, args);
                });
            });
        },
        emit: (event, data, callback) => {
            socket.emit(event, data, function() {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket,args);
                    }
                });
            });
        }
    }
});