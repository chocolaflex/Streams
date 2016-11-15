class LogoutCtrl {
    constructor($location, $auth, toastr) {
        LogoutCtrl.$injecter = ['$location', '$auth', 'toastr'];
        this.$location = $location;
        this.$auth = $auth;
        this.toastr = toastr;

        if (!this.$auth.isAuthenticated()) return;
        this.$auth.logout()
            .then(() => {
                this.toastr.info('You have been logged out');
                this.$location.path('/');
            });
    }
}
app.component('logoutCmp', {
    template: '',
    controller: LogoutCtrl
});