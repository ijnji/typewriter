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

    $scope.sendLogin = function(loginInfo) {

        $scope.error = null;

        AuthService.login(loginInfo).then(function() {
            Socket.emit('clnEveUserLobby');
            console.log('hey putshed name');
            $state.go('home');
        }).catch(function() {
            $scope.error = 'Invalid login credentials.';
        });

    };

});
