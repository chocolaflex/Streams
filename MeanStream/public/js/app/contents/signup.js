'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SignupCtrl = function () {
    function SignupCtrl($auth, $location, toastr) {
        _classCallCheck(this, SignupCtrl);

        this.$injecter = ['$auth', '$location', 'toastr'];
        this.$auth = $auth;
        this.$location = $location;
        this.toastr = toastr;
    }

    _createClass(SignupCtrl, [{
        key: 'signup',
        value: function signup() {
            var _this = this;

            this.$auth.signup(this.user).then(function (response) {
                _this.$auth.setToken(response);
                _this.$location.path('/');
                _this.toastr.info('You have successfully created a new account and been signed-in');
            }).catch(function (response) {
                _this.toastr.error(response.data.message);
            });
        }
    }]);

    return SignupCtrl;
}();

app.component('signupCmp', {
    templateUrl: 'partials/signup.html',
    controller: SignupCtrl
});