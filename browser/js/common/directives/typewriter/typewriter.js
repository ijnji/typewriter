app.directive('typewriter', function(PlayerFactory, InputFactory, GameFactory, DrawFactory, Socket) {

    let directive = {};

    directive.restrict = 'E';
    directive.scope = {};
    directive.templateUrl = 'js/common/directives/typewriter/typewriter.html';

    directive.link = function(scope) {

        $(document).ready(function() {
            DrawFactory.initialize();
            InputFactory.watchKeys();
        });

        let playerMe = new PlayerFactory.Player(Socket.io.engine.id);
        let playerRival = new PlayerFactory.Player();
        let theGame = new GameFactory.Game();
        let interval = setInterval(function() {
            this.gameTime++
        }, 1000)
        let continueGame;

        scope.me = playerMe;
        scope.rival = playerRival;
        scope.gameover = false;

        const timeStart = Date.now();
        requestAnimationFrame(gameLoop);

        Socket.on('newKey', function(payload) {
            if (playerMe.id === payload.id) {
                if (payload.key === 'Enter') {
                    console.log('received enter key');
                    playerMe.validateInput(DrawFactory.removeWordMe);
                } else if (payload.key === 'Backspace'){
                    playerMe.removeChar();
                } else if (payload.key.charCodeAt(0) >= 97 && payload.key.charCodeAt(0) <= 122) {
                    playerMe.newChar(payload.key);
                }
            } else {
                if (payload.key === 'Enter') {
                    playerRival.validateInput(DrawFactory.removeWordRival);
                } else if (payload.key === 'Backspace') {
                    playerRival.removeChar();
                } else if (payload.key.charCodeAt(0) >= 97 && payload.key.charCodeAt(0) <= 122) {
                    playerRival.newChar(payload.key);
                }
            }
            scope.$digest();
        });

        Socket.on('eveSrvWord', function(payload) {
            playerMe.addWord(payload.text, payload.duration);
            DrawFactory.addWordMe(payload.text, payload.duration, payload.xoffset);

            playerRival.addWord(payload.text, payload.duration);
            DrawFactory.addWordRival(payload.text, payload.duration, payload.xoffset);

            scope.$digest();
        });

        Socket.on('endGame', function(payload) {
            GameFactory.Game.handleGameOver(playerMe, payload.loserId);
            //playerMe.showAccuracy();
            cancelAnimationFrame(continueGame);
            scope.gameover = true;
            console.log('GAME OVER');
        });
        Socket.on('playerLeave', function() {
            playerMe.win = true;
            scope.$digest();
        });
        Socket.on('eventDiff', function(event) {
            console.log('Event Words', event.words)

        })

        // Main game loop.
        function gameLoop() {
            DrawFactory.updatePositions();
            // DrawFactory.removeTimedoutMe(GameFactory.Game.emitGameOver);
            DrawFactory.removeTimedoutMe();
            DrawFactory.removeTimedoutRival();
            continueGame = requestAnimationFrame(gameLoop);
            // For loss, use the following.
            //theGame.emitGameOver();
        }
    };

    return directive;

});

