app.config(function($stateProvider) {
    $stateProvider.state('frontpage', {
        cache: false,
        url: '/',
        templateUrl: 'js/frontpage/frontpage.html',
        controller: 'FrontpageCtrl',
    });
});

app.controller('FrontpageCtrl', function($scope, $state, SocketFactory, AudioFactory, SocketService) {
    let Socket = SocketFactory.socket;
    $scope.$on('refreshedSocket', function(payload) {
        Socket = payload.socket;
    });
    // document.onkeydown = function () {
    //     AudioFactory.play('singletype');
    // };
    // if($stateParams.reload === 'true'){
    //     console.log('reloading page');
    //     $state.go('frontpage', {}, {reload: true});
    // }
    $scope.randomMatch = function() {
        $scope.searching = true;
        Socket.emit('randomMatch');
    };

    Socket.on('gameStart', gameStartFunc);
    function gameStartFunc(payload) {
       $('#waiting').closeModal();
       $scope.searching = false;
       $state.go('game', { gameId: payload.room });
   }


    $scope.runLogo = function(){
        $('.element').typed({
            strings: ['TypeRightr'],
            typeSpeed: 50
        });
    }

    $(document).ready(function(){
            $('.trigger-searching').leanModal({
            complete: function () {
                $scope.searching = false;
                Socket.emit('stopMatch');
            }
        });
  });

});
