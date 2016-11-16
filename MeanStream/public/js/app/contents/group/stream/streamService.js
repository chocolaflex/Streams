'use strict';

app.factory('streamService', function ($http) {
    return function (groupId, streamId) {
        return new Promise(function (resolve, reject) {
            $http.get('api/groups/' + groupId + '/streams/' + streamId).then(function (res) {
                resolve(res.data);
            }, function (error) {
                reject(error);
            });
        });
    };
});