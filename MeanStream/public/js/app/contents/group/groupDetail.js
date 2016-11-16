'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GroupDetailCtrl = function () {
    function GroupDetailCtrl(groupService, params) {
        _classCallCheck(this, GroupDetailCtrl);

        this.$injecter = ['groupService', 'params'];
        this.groupService = groupService;
        this.params = params;
    }

    _createClass(GroupDetailCtrl, [{
        key: '$routerOnActivate',
        value: function $routerOnActivate(next) {
            var _this = this;

            this.groupId = this.params.gid;

            this.groupService(this.groupId).then(function (group) {
                _this.group = group;
            });
        }
    }]);

    return GroupDetailCtrl;
}();

app.component('groupDetailCmp', {
    templateUrl: 'partials/group/detail.html',
    controller: GroupDetailCtrl
});