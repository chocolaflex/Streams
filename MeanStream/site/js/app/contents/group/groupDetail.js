class GroupDetailCtrl {
    constructor(groupService) {
        this.$injecter = ['groupService'];
        this.groupService = groupService;
        this.group = groupService.get();
    }
}
app.component('groupDetailCmp', {
    templateUrl: 'partials/group/detail.html',
    controller: GroupDetailCtrl
});