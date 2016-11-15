class HeaderCtrl {
    constructor($auth) {
        HeaderCtrl.$injecter = ['$auth'];
        this.$auth = $auth;
    }
    isAuthenticated() {
        return this.$auth.isAuthenticated();
    }

}

app.component('headerCmp', {
    templateUrl: 'partials/header.html',
    controller: HeaderCtrl
});