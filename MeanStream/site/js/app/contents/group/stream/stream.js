class StreamCtrl {
    constructor($socket,$http,groupService) {
        StreamCtrl.$injecter = ['$socket','$http','groupService'];
        this.$socket = $socket;
        this.$http = $http;
        this.groupService = groupService;
        this.group = this.groupService.get();
    }
    $routerOnActivate(next) {
        this.id = next.params.id;
        this.$http.get(`api/groups/${this.group.id}/streams/${this.id}`)
            .then((res) => {
                this.stream = res.data;
                //this.$parent.title = data.title;
                //this.count = data.count;
                if (this.stream.access) {
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
                        }
                        this.$socket.on('s2c_message', (message) => {
                            this.stream.responses.push(message);
                        });
                    });
                }
            }, (error) => {

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