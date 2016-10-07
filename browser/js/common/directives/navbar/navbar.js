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

            // var setUser = function() {
            //     console.log('setUser');
            //     AuthService.getLoggedInUser().then(function(user) {
            //         console.log(user);
            //         $rootScope.loggedUser = user;
            //         $rootScope.user = user.username;
            //         scope.user = $rootScope.user;
            //         console.log($rootScope.user);
            //     });
            // };

            var removeUser = function() {
                scope.loggedUser = null;
            };

            // setUser();

            // $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            // $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            // $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});
