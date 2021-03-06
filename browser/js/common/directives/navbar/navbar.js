app.directive('navbar', function($rootScope, $state, AuthService, AUTH_EVENTS, Socket) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function(scope) {


            scope.items = [
                { label: 'Home', state: 'frontpage' },
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

            Socket.on('setUsername', function (payload){
                $rootScope.user = payload.username;
                scope.user = $rootScope.user;
                scope.$digest();
            })

            var setUser = function() {

                AuthService.getLoggedInUser().then(function(user) {
                    $rootScope.loggedUser = user;
                    $rootScope.user = user.username;
                    scope.user = $rootScope.user;
                });
            };

            var removeUser = function() {
                scope.loggedUser = null;
                $rootScope.loggedUser = null;
            };

            // setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});
