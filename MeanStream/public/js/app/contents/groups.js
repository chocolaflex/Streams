'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GroupsCtrl = function GroupsCtrl() {
    _classCallCheck(this, GroupsCtrl);
};

app.component('groupsCmp', {
    template: '<ng-outlet></ng-outlet>',
    $routeConfig: [{
        path: '/',
        name: 'GroupList',
        component: 'groupListCmp'
    }, {
        path: '/:id/...',
        name: 'Group',
        component: 'groupCmp'
    }]
});