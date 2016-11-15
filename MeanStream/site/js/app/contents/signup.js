class SignupCtrl {
    constructor($auth,$location,toastr) {
        this.$injecter = ['$auth','$location','toastr'];
        this.$auth = $auth;
        this.$location = $location;
        this.toastr = toastr;
    }
    signup() {
        this.$auth.signup(this.user)
            .then((response) => {
                this.$auth.setToken(response);
                this.$location.path('/');
                this.toastr.info('You have successfully created a new account and been signed-in');
            })
            .catch((response) => {
                this.toastr.error(response.data.message);
            });
    }
}

app.component('signupCmp', {
    templateUrl: 'partials/signup.html',
    controller: SignupCtrl
});