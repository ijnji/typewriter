app.config(function($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function($scope, AuthService, $state, Socket) {

    $scope.login = {};
    $scope.error = null;
    $scope.submitted = false;

    $scope.sendLogin = function(loginInfo) {

        $scope.error = null;
        $scope.submitted = true;

        AuthService.login(loginInfo).then(function(user) {
            Socket.emit('loginUser', { username: user.username });
            $state.go('lobby');
        }).catch(function() {
            $scope.error = 'Invalid login credentials.';
        });

    };

});
