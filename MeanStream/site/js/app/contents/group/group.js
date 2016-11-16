class GroupCtrl {
    constructor($http, groupService,params) {
        GroupCtrl.$inject = ['$http', 'groupService','params'];
        this.groupService = groupService;
        this.params = params;
        this.$routerOnActivate = (next) => {
            this.params.gid = next.params.gid;
        }
    }
}
app.component('groupCmp', {
    controller: GroupCtrl,
    template: `<ng-outlet></ng-outlet>`,
    $routeConfig: [
        {
            path: '/',
            name: 'GroupDetail',
            component: 'groupDetailCmp',
            data: '$ctrl.group'
        },
        {
            path: '/streams',
            name: 'StreamList',
            component: 'streamListCmp'
        },
        {
            path: '/streams/:sid',
            name: 'Stream',
            component: 'streamCmp'
        }
    ]
});