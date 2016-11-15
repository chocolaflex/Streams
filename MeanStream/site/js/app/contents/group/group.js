class GroupCtrl {
    constructor($http, groupService) {
        this.$injecter = ['$http', 'groupService'];
        this.groupService = groupService;
        this.$routerOnActivate = (next) => {
            this.id = next.params.id;
            $http.get(`api/groups/${this.id}`)
                .then((res) => {
                    this.groupService.set(res.data);
                }, (error) => {

                });
        }
    }
}
app.component('groupCmp', {
    controller: GroupCtrl,
    template: `<ng-outlet></ng-outlet><pre>`,
    $routeConfig: [
        {
            path: '/',
            name: 'GroupDetail',
            component: 'groupDetailCmp',
            data: '$ctrl.group'
        },
        {
            path: '/streams/...',
            name: 'StreamsCmp',
            component: 'streamsCmp'
        }
    ]
});