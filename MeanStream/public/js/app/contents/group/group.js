'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GroupCtrl = function GroupCtrl($http, groupService, params) {
    var _this = this;

    _classCallCheck(this, GroupCtrl);

    GroupCtrl.$inject = ['$http', 'groupService', 'params'];
    this.groupService = groupService;
    this.params = params;
    this.$routerOnActivate = function (next) {
        _this.params.gid = next.params.gid;
    };
};

app.component('groupCmp', {
    controller: GroupCtrl,
    template: '<ng-outlet></ng-outlet>',
    $routeConfig: [{
        path: '/',
        name: 'GroupDetail',
        component: 'groupDetailCmp',
        data: '$ctrl.group'
    }, {
        path: '/streams',
        name: 'StreamList',
        component: 'streamListCmp'
    }, {
        path: '/streams/:sid',
        name: 'Stream',
        component: 'streamCmp'
    }]
});