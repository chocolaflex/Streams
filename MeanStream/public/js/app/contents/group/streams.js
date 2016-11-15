'use strict';

app.component('streamsCmp', {
    template: '<ng-outlet></ng-outlet>',
    $routeConfig: [{
        path: '/',
        name: 'StreamList',
        component: 'streamListCmp'
    }, {
        path: '/:id',
        name: 'Stream',
        component: 'streamCmp'
    }]
});