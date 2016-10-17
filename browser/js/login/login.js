app.config(function($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function($scope, AuthService, $state, SocketService) {
    $scope.login = {};
    $scope.error = null;
    $scope.submitted = false;

    $scope.sendLogin = function(loginInfo) {
        $scope.error = null;
        $scope.submitted = true;

        AuthService.login(loginInfo).then(function (user) {
            SocketService.loginOrLogoutHandler();
        }).catch(function() {
            $scope.error = 'Invalid login credentials.';
        });

    };



});
