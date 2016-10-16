app.directive('userInfo', function($rootScope, $state, AuthService, AUTH_EVENTS, SocketFactory, SocketService) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/userinfo/userinfo.html',
        link: function(scope) {
            let Socket = SocketFactory.socket;
            console.log(Socket);
            scope.$on('refreshedSocket', function(event, data) {
                Socket = data.socket;
                console.log(Socket);
                Socket.on('setUser', setUserFunc);
            });

            scope.isLoggedIn = function() {
                var loggedIn = AuthService.isAuthenticated();
                return loggedIn;
            };

            scope.logout = function() {
                AuthService.logout().then(function() {
                    SocketService.loginOrLogoutHandler();
                });
            };

            scope.login = function() {
                $state.go('login');
            }

            scope.signup = function() {
                $state.go('signup');
            }

            Socket.on('setUser', setUserFunc)
            function setUserFunc(payload) {
               console.log('settingUser');
               $rootScope.rootScopeUser = payload.user;
               scope.user = $rootScope.rootScopeUser;
               console.log(scope.user.username);
               scope.$digest();
            }

            var setUser = function() {
                AuthService.getLoggedInUser()
                .then(function(user) {
                    // $rootScope.loggedUser = user;
                    if(user){
                        $rootScope.rootScopeUser = user;
                        scope.user = $rootScope.rootScopeUser;
                    }
                });
            };

            var removeUser = function() {
                scope.user = null;
                $rootScope.loggedUser = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});
