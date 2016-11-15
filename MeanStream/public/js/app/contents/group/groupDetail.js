'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GroupDetailCtrl = function GroupDetailCtrl(groupService) {
    _classCallCheck(this, GroupDetailCtrl);

    this.$injecter = ['groupService'];
    this.groupService = groupService;
    this.group = groupService.get();
};

app.component('groupDetailCmp', {
    templateUrl: 'partials/group/detail.html',
    controller: GroupDetailCtrl
});