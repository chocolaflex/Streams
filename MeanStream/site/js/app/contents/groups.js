class GroupsCtrl {
    constructor() {
    }
}

app.component('groupsCmp', {
    template: `<ng-outlet></ng-outlet>`,
    $routeConfig: [
        {
            path: '/',
            name: 'GroupList',
            component: 'groupListCmp',
        },
        {
            path: '/:id/...',
            name: 'Group',
            component: 'groupCmp'
        }
    ]
});