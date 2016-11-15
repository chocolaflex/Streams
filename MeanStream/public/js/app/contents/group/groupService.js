'use strict';

app.factory('groupService', function () {
    var g = {};
    return {
        set: function set(group) {
            g = group;
        },
        get: function get() {
            return g;
        }
    };
});