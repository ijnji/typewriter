app.directive('rematch', function(SocketFactory, $state) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/rematch/rematch.html',
        link: function(scope) {
            let Socket = SocketFactory.socket;
            scope.$on('refreshedSocket', function(payload) {
                Socket = payload.socket;
            });

            scope.randomMatch = function() {
                scope.searching = true;
                Socket.emit('randomMatch');
            };

            Socket.on('gameStart', gameStartFunc);

            function gameStartFunc(payload) {
                $('#waitinggame').closeModal();
                scope.searching = false;
                $state.go('game', { gameId: payload.room });
            }

            $(document).ready(function() {
                $('.trigger-searching').leanModal({
                    complete: function() {
                        $scope.searching = false;
                        Socket.emit('stopMatch');
                    }
                });
            });
        }
    }
})
