app.directive('typewriter', function($rootScope, $state, PlayerFactory, InputFactory, DrawFactory, Socket) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/typewriter/typewriter.html',
        // controller: 'GameCtrl',
        link: function(scope) {
            InputFactory.watchKeys();
            let playerMe = new PlayerFactory.Player(Socket.io.engine.id);
            let playerRival = new PlayerFactory.Player();
            scope.me = playerMe;
            scope.rival = playerRival;

            Socket.on('eveSrvKey', function(payload) {
              if (playerMe.id === payload.id) {
                playerMe.newChar(payload.key);
              }
              else {
                playerRival.newChar(payload.key);
              }
              scope.$digest();
            });
            Socket.on('eveSrvWord', function(event){
              playerMe.addWord(event.word, 5);
              playerRival.addWord(event.word, 5);
              scope.$digest();
            });
            // Main game loop.
            // Input modifies the game state. View draws based on game state.
        }

    };

});
