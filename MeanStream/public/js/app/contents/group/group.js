'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GroupCtrl = function GroupCtrl($http, groupService) {
    var _this = this;

    _classCallCheck(this, GroupCtrl);

    this.$injecter = ['$http', 'groupService'];
    this.groupService = groupService;
    this.$routerOnActivate = function (next) {
        _this.id = next.params.id;
        $http.get('api/groups/' + _this.id).then(function (res) {
            _this.groupService.set(res.data);
        }, function (error) {});
    };
};

app.component('groupCmp', {
    controller: GroupCtrl,
    template: '<ng-outlet></ng-outlet><pre>',
    $routeConfig: [{
        path: '/',
        name: 'GroupDetail',
        component: 'groupDetailCmp',
        data: '$ctrl.group'
    }, {
        path: '/streams/...',
        name: 'StreamsCmp',
        component: 'streamsCmp'
    }]
});