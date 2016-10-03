app.directive('typewriter', function($rootScope, $state, PlayerFactory, GameFactory, InputFactory, Socket) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/typewriter/typewriter.html',
      
        link: function(scope) {
            InputFactory.watchKeys();
            let playerMe = new PlayerFactory.Player(Socket.io.engine.id);
            let playerRival = new PlayerFactory.Player();
            let theGame = new GameFactory.Game();
            let interval = setInterval(function() {
              this.gameTime++
            },1000)
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
              // console.log(event);
              playerMe.addWord(event.word, 5);
              playerRival.addWord(event.word, 5);
              scope.$digest();
            });
            Socket.on('eveSrvGameOver', function(event){
              GameFactory.handleGameOver(playerMe, event.loserId);
            });
            Socket.on('eventDiff', function(event) {
               event.words
                 
              })

            
            // Main game loop.
            // Input modifies the game state. View draws based on game state.
            function gameLoop(){
              
              for (let letter in playerMe.activeWords){
                let word = playerMe.activeWords[letter];
                if (word) {
                  // console.log(playerMe.activeWords[letter]);
                  if (Date.now() > playerMe.activeWords[letter].end) {
                    //Client has lost;
                    console.log('I HAVE LOST');
                    return GameFactory.emitGameOver();
                  }
                }
              }
              requestAnimationFrame(gameLoop);
            }
            const timeStart = Date.now();
            requestAnimationFrame(gameLoop);
        }

    };

});
