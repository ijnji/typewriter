app.directive('userInfo', function($rootScope, $state, AuthService, AUTH_EVENTS, Socket) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/userinfo/userinfo.html',
        link: function(scope) {

            scope.toggle = function() {
                scope.checked = !scope.checked
            }
            scope.isLoggedIn = function() {
                var loggedIn = AuthService.isAuthenticated();
                return loggedIn;
            };

            scope.logout = function() {
                AuthService.logout().then(function() {
                    $state.go('frontpage');
                });
            };

            Socket.on('setUsername', function(payload) {
                $rootScope.user = payload.username;
                scope.user = $rootScope.user;
                scope.$digest();
            })

            var setUser = function() {
                AuthService.getLoggedInUser()
                    .then(function(user) {
                        $rootScope.loggedUser = user;
                        $rootScope.user = user.username;
                        scope.user = $rootScope.user;
                    });
            };

            var removeUser = function() {
                scope.user = null;
                $rootScope.loggedUser = null;
                scope.$digest();
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});
