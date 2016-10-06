app.directive('navbar', function($rootScope, $state, AuthService, AUTH_EVENTS, Socket) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function(scope) {


            scope.items = [
                { label: 'Lobby', state: 'lobby' }
            ];

            scope.user = null;

            scope.isLoggedIn = function() {
                return AuthService.isAuthenticated();
            };

            scope.logout = function() {
                AuthService.logout().then(function() {
                    $state.go('home');
                });
            };
            console.log('here');
            Socket.on('setUsername', function (payload){
                console.log(payload);
                scope.user = payload.username;
                console.log(payload);
                scope.$digest();
            })

            // var setUser = function() {
            //     console.log('setUser');
            //     AuthService.getLoggedInUser().then(function(user) {
            //         scope.user = user;
            //     });
            // };

            var removeUser = function() {
                scope.user = null;
            };

            // setUser();

            // $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            // $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            // $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});
