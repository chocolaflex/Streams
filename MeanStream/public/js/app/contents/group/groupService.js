'use strict';

app.factory('groupService', function ($http) {
    return function (groupId) {
        return new Promise(function (resolve, reject) {
            $http.get('api/groups/' + groupId).then(function (res) {
                resolve(res.data);
            }).catch(function (error) {
                reject(error);
            });
        });
    };
});