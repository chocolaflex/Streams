
app.factory('groupService', () => {
    let g = {};
    return {
        set: (group) => {
            g = group;
        },
        get: () => {
            return g;
        }
    }
});