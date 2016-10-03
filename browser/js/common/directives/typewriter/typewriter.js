app.directive('typewriter', function($rootScope, $state, PlayerFactory, InputFactory, GameFactory, Socket) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/typewriter/typewriter.html',
        // controller: 'GameCtrl',
        link: function(scope) {
            InputFactory.watchKeys();
            const playerMe = new PlayerFactory.Player(Socket.io.engine.id);
            const playerRival = new PlayerFactory.Player();
            scope.me = playerMe;
            scope.rival = playerRival;
            const timeStart = Date.now();
            requestAnimationFrame(gameLoop);
            Socket.on('eveSrvKey', function(payload) {
              if (playerMe.id === payload.id) {
                playerMe.newChar(payload.key);
              }
              else {
                playerRival.newChar(payload.key);
              }
              scope.$digest();
            });
            Socket.on('eveSrvWord', function(payload){
              playerMe.addWord(payload.word, 4);
              playerRival.addWord(payload.word, 4);
              scope.$digest();
            });
            Socket.on('eveSrvGameOver', function(payload){
              GameFactory.handleGameOver(playerMe, payload.loserId);
            });
            Socket.on('playerLeave', function(){
              playerMe.win = true;
              scope.$digest();
            });
            // Main game loop.
            // Input modifies the game state. View draws based on game state.
            function gameLoop(){
              for (let letter in playerMe.activeWords) {
                let word = playerMe.activeWords[letter];
                if (word) {
                  if (Date.now() > word.end){
                    console.log('I LOSE SO HARD');
                    return GameFactory.emitGameOver();
                  }
                }
              }
              requestAnimationFrame(gameLoop);
            }
        }

    };

});
