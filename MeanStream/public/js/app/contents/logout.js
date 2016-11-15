'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LogoutCtrl = function LogoutCtrl($location, $auth, toastr) {
    var _this = this;

    _classCallCheck(this, LogoutCtrl);

    LogoutCtrl.$injecter = ['$location', '$auth', 'toastr'];
    this.$location = $location;
    this.$auth = $auth;
    this.toastr = toastr;

    if (!this.$auth.isAuthenticated()) return;
    this.$auth.logout().then(function () {
        _this.toastr.info('You have been logged out');
        _this.$location.path('/');
    });
};

app.component('logoutCmp', {
    template: '',
    controller: LogoutCtrl
});