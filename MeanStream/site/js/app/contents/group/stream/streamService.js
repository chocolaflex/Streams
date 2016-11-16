app.factory('streamService', ($http) => {
    return (groupId, streamId) => {
        return new Promise((resolve, reject) => {
            $http.get(`api/groups/${groupId}/streams/${streamId}`)
                .then((res) => {
                    resolve(res.data);
                }, (error) => {
                    reject(error);
                });
        });
    };
});