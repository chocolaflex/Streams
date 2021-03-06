﻿
app.factory('groupService', ($http) => {
    return (groupId) => {
        return new Promise((resolve, reject) => {
            $http.get(`api/groups/${groupId}`)
                .then((res) => {
                    resolve(res.data);
                }).catch((error) => {
                    reject(error);
                });
        });
    }
});