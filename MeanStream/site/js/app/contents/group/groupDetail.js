class GroupDetailCtrl {
    constructor(groupService,params) {
        this.$injecter = ['groupService','params'];
        this.groupService = groupService;
        this.params = params;
    }
    $routerOnActivate(next) {
        this.groupId = this.params.gid;

        this.groupService(this.groupId)
            .then((group) => {
                this.group = group;
            });
    }
}
app.component('groupDetailCmp', {
    templateUrl: 'partials/group/detail.html',
    controller: GroupDetailCtrl
});