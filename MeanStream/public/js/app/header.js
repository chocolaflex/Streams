'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HeaderCtrl = function () {
    function HeaderCtrl($auth) {
        _classCallCheck(this, HeaderCtrl);

        HeaderCtrl.$injecter = ['$auth'];
        this.$auth = $auth;
    }

    _createClass(HeaderCtrl, [{
        key: 'isAuthenticated',
        value: function isAuthenticated() {
            return this.$auth.isAuthenticated();
        }
    }]);

    return HeaderCtrl;
}();

app.component('headerCmp', {
    templateUrl: 'partials/header.html',
    controller: HeaderCtrl
});