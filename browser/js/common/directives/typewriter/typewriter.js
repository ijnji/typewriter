app.directive('typewriter', function(PlayerFactory, InputFactory, GameFactory, DrawFactory, Socket) {

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
            }, 1000)

            scope.me = playerMe;
            scope.rival = playerRival;
            const timeStart = Date.now();
            requestAnimationFrame(gameLoop);

            Socket.on('newKey', function(payload) {
                if (playerMe.id === payload.id) {
                    if (payload.key === 'Enter') {
                        playerMe.validateInput(payload.key);
                    } else if (payload.key === 'Backspace'){
                        playerMe.removeChar(payload.key);
                    } else if (payload.key.charCodeAt(0) >= 97 && payload.key.charCodeAt(0) <= 122) {
                        playerMe.newChar(payload.key);
                    }
                } else {
                    if (payload.key === 'Enter') {
                        playerRival.validateInput(payload.key);
                    } else if (payload.key === 'Backspace') {
                        playerRival.removeChar(payload.key);
                    } else if (payload.key.charCodeAt(0) >= 97 && payload.key.charCodeAt(0) <= 122) {
                        playerRival.newChar(payload.key);
                    }
                }
                scope.$digest();
            });

            Socket.on('eveSrvWord', function(event) {
                playerMe.addWord(event.word, 5);
                playerRival.addWord(event.word, 5);
                scope.$digest();
            });

            Socket.on('endGame', function(payload) {
                GameFactory.handleGameOver(playerMe, payload.loserId);
            });
            Socket.on('playerLeave', function() {
                playerMe.win = true;
                scope.$digest();
            });
            Socket.on('eventDiff', function(event) {
                console.log('Event Words', event.words)

            })


            // Main game loop.
            // Input modifies the game state. View draws based on game state.
            function gameLoop() {

                for (let letter in playerMe.activeWords) {
                    let word = playerMe.activeWords[letter];
                    if (word) {
                        if (Date.now() > word.end) {
                            console.log('I LOSE SO HARD');
                            return theGame.emitGameOver();
                        }
                    }
                }
                requestAnimationFrame(gameLoop);
            }
        }

    };

});
