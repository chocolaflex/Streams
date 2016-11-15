'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoginCtrl = function () {
    function LoginCtrl($location, $auth, toastr) {
        _classCallCheck(this, LoginCtrl);

        LoginCtrl.$inject = ['$location', '$auth', 'toastr'];
        this.$location = $location;
        this.$auth = $auth;
        this.toastr = toastr;
    }

    _createClass(LoginCtrl, [{
        key: 'login',
        value: function login() {
            var _this = this;

            this.$auth.login(this.user).then(function () {
                _this.toastr.success('You have successfully signed in!');
                _this.$location.path('/');
            }).catch(function (error) {
                _this.toastr.error(error.data.message, error.status);
            });
        }
    }, {
        key: 'authenticate',
        value: function authenticate(provider) {
            var _this2 = this;

            this.$auth.authenticate(provider).then(function () {
                _this2.toastr.success('You have Successfully signed in with ' + provider + '!');
                _this2.$location.path('/');
            }).catch(function (error) {
                if (error.message) {
                    _this2.toastr.error(error.message);
                } else if (error.data) {
                    _this2.toastr.error(error.data.message, error.status);
                } else {
                    _this2.toastr.error(error);
                }
            });
        }
    }]);

    return LoginCtrl;
}();

app.component('loginCmp', {
    templateUrl: 'partials/login.html',
    controller: LoginCtrl
});