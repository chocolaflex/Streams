'use strict';

var app = angular.module('app', ['ngComponentRouter', 'satellizer', 'toastr']);
app.config(function ($authProvider) {

    /**
     * Helper auth functions
     */
    var skipIfLoggedIn = ['$q', '$auth', function ($q, $auth) {
        var deferred = $q.defer();
        if ($auth.isAuthenticated()) {
            deferred.reject();
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }];

    var loginRequired = ['$q', '$location', '$auth', function ($q, $location, $auth) {
        var deferred = $q.defer();
        if ($auth.isAuthenticated()) {
            deferred.resolve();
        } else {
            $location.path('/login');
        }
        return deferred.promise;
    }];
    /**
     *  Satellizer config
     */
    $authProvider.google({
        clientId: 'YOUR_GOOGLE_CLIENT_ID'
    });
    $authProvider.twitch({
        clientId: 'YOUR_TWITCH_CLIENT_ID'
    });

    $authProvider.twitter({
        url: '/auth/twitter'
    });

    $authProvider.oauth2({
        name: 'foursquare',
        url: '/auth/foursquare',
        clientId: 'MTCEJ3NGW2PNNB31WOSBFDSAD4MTHYVAZ1UKIULXZ2CVFC2K',
        redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
        authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate'
    });
});

app.value('$routerRootComponent', 'app');
app.component('app', {
    template: '<header-cmp></header-cmp>\n        <ng-outlet class="main-wrapper"></ng-outlet>\n        <footer-cmp></footer-cmp>',
    $routeConfig: [{
        path: '/',
        name: 'Home',
        component: 'homeCmp',
        useAsDefault: true
    }, {
        path: '/login',
        name: 'Login',
        component: 'loginCmp'
    }, {
        path: '/signup',
        name: 'Signup',
        component: 'signupCmp'
    }, {
        path: '/logout',
        name: 'Logout',
        component: 'logoutCmp'
    }, {
        path: '/groups',
        name: 'GroupList',
        component: 'groupListCmp'
    }, {
        path: '/groups/:gid/...',
        name: 'Group',
        component: 'groupCmp'
    }]
});