class LoginCtrl {
    constructor($location,$auth,toastr) {
        LoginCtrl.$inject = ['$location', '$auth', 'toastr'];
        this.$location = $location;
        this.$auth = $auth;
        this.toastr = toastr;
    }
    login() {
        this.$auth.login(this.user)
            .then(() => {
                this.toastr.success('You have successfully signed in!');
                this.$location.path('/');
            })
            .catch((error) => {
                this.toastr.error(error.data.message, error.status);
            });
    }
    authenticate(provider) {
        this.$auth.authenticate(provider)
            .then(() => {
                this.toastr.success(`You have Successfully signed in with ${provider}!`);
                this.$location.path('/');
            })
            .catch((error) => {
                if (error.message) {
                    this.toastr.error(error.message);
                } else if (error.data) {
                    this.toastr.error(error.data.message, error.status);
                } else {
                    this.toastr.error(error);
                }
            });
    }
}

app.component('loginCmp', {
    templateUrl: 'partials/login.html',
    controller: LoginCtrl
});