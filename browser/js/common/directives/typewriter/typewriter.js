app.directive('typewriter', function(PlayerFactory, InputFactory, GameFactory, DrawFactory, Socket, SocketService, UtilityFactory) {

    let directive = {};
    directive.restrict = 'E';
    directive.scope = {};
    directive.templateUrl = 'js/common/directives/typewriter/typewriter.html';

    directive.link = function(scope) {
        let startTime, endTime, totalTime;
        $(document).ready(function() {
            scope.gameover = false;
            DrawFactory.initialize();
            InputFactory.watchKeys();
            startTime = Date.now();
        });

        let playerMe = new PlayerFactory.Player(Socket.io.engine.id);
        let playerRival = new PlayerFactory.Player();
        let theGame = new GameFactory.Game();
        scope.me = playerMe;
        scope.rival = playerRival;

        scope.gameover = false;
        scope.rivalUser = SocketService.getRival();
        requestAnimationFrame(gameLoop);
        let continueGame;

        Socket.on('newKey', function(payload) {
            if (playerMe.id === payload.id) {
                if (payload.key === 'Enter' || payload.key === ' ') {
                    const hit = playerMe.validateInput(DrawFactory.removeWordMe);
                    if (hit) {
                        Socket.emit('wordHit');
                    }
                    else{
                        Socket.emit('wordMiss');
                    }
                } else if (payload.key === 'Backspace'){
                    playerMe.removeChar();
                } else if (payload.key.charCodeAt(0) >= 97 && payload.key.charCodeAt(0) <= 122) {
                    playerMe.newChar(payload.key);
                }
            } else {
                if (payload.key === 'Enter' || payload.key === ' ') {
                    playerRival.validateInput(DrawFactory.removeWordRival);
                    if (hit) {
                        Socket.emit('wordHit');
                    }
                    else{
                        Socket.emit('wordMiss');
                    }
                } else if (payload.key === 'Backspace') {
                    playerRival.removeChar();
                } else if (payload.key.charCodeAt(0) >= 97 && payload.key.charCodeAt(0) <= 122) {
                    playerRival.newChar(payload.key);
                }
            }
            scope.$digest();
        });

        Socket.on('newWord', function(event) {
            if(scope.gameover) return;
            playerMe.addWord(event.text, event.duration);
            playerRival.addWord(event.text, event.duration);
            DrawFactory.addWordMe(event.text, event.duration, event.xoffset);
            DrawFactory.addWordRival(event.text, event.duration, event.xoffset);
        });

        Socket.on('endGame', function(payload) {

            GameFactory.Game.handleGameOver(playerMe, payload.loserId);
            scope.gameover = true;
            scope.$evalAsync();
        });
        Socket.on('playerLeave', function() {
            playerMe.win = true;
            scope.$digest();
        });
        Socket.on('eventDiff', function(event) {
            console.log('Event Words', event.words)

        });

        Socket.on('wordHit', function(payload){
            console.log('SOMEONE HIT HIT')
            const playerId = UtilityFactory.stripSocketIdPrefix(payload.playerId);
            if (playerId ===  playerMe.id) {
                console.log('I HIT');
                playerMe.incrementStreak();
            }
            else {
                console.log('RIVAL HIT');
                playerRival.incrementStreak();
            }
            scope.$digest();
        })

        Socket.on('wordMiss', function(payload){
            const playerId = UtilityFactory.stripSocketIdPrefix(payload.playerId);
            if (playerId === playerMe.id) {
                console.log('I MISS');
                playerMe.resetStreak();
            }
            else {
                console.log('RIVAL MISS');
                playerRival.resetStreak();
            }
            scope.$digest();
        })


        // Main game loop.
        function gameLoop() {
            if (!scope.gameover) {
                DrawFactory.updatePositions();
                DrawFactory.removeTimedoutMe(GameFactory.Game.emitGameOver);
                // DrawFactory.removeTimedoutMe();
                DrawFactory.removeTimedoutRival();
                continueGame = requestAnimationFrame(gameLoop);
            } else {
                endTime = Date.now();
                totalTime = endTime - startTime;
                let wpm = playerMe.wordsPerMinute(totalTime);
                let accuracy = playerMe.showAccuracy();
                console.log('wpm', wpm, 'accuracy', accuracy)
            }
        }
    };

    return directive;

});
