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

        let animationFrameReference = requestAnimationFrame(gameLoop);

        scope.me = playerMe;
        scope.rival = playerRival;
        scope.gameover = false;
        scope.rivalUser = SocketService.getRival();

        scope.$on('$distroy', function() {
            window.cancelAnimationFrame(animationFrameReference);
            Socket.removeListener('newKey', newKeyFunc);
            Socket.removeListener('newWord', newWordFunc);
            Socket.removeListener('endGame', endGameFunc);
            Socket.removeListener('playerLeave', playerLeaveFunc);
            Socket.removeListener('wordHit', wordHitFunc);
            Socket.removeListener('wordMiss', wordMissFunc);
        });

        Socket.on('newKey', newKeyFunc);
        function newKeyFunc(payload) {
            if (playerMe.id === payload.id) {
                if (payload.key === 'Enter' || payload.key === ' ') {
                    const hit = playerMe.validateInput(DrawFactory.removeWordMe);
                    if (hit) {
                        Socket.emit('wordHit');
                    } else {
                        Socket.emit('wordMiss');
                    }
                } else if (payload.key === 'Backspace') {
                    playerMe.removeChar();
                } else if (payload.key.charCodeAt(0) >= 97 && payload.key.charCodeAt(0) <= 122) {
                    playerMe.newChar(payload.key);
                }
            } else {
                if (payload.key === 'Enter' || payload.key === ' ') {
                    playerRival.validateInput(DrawFactory.removeWordRival);
                } else if (payload.key === 'Backspace') {
                    playerRival.removeChar();
                } else if (payload.key.charCodeAt(0) >= 97 && payload.key.charCodeAt(0) <= 122) {
                    playerRival.newChar(payload.key);
                }
            }
            scope.$digest();
        }

        Socket.on('newWord', newWordFunc);
        function newWordFunc(event) {
            if (scope.gameover) return;
            playerMe.addWord(event.text, event.duration);
            playerRival.addWord(event.text, event.duration);
            DrawFactory.addWordMe(event.text, event.duration, event.xoffset);
            DrawFactory.addWordRival(event.text, event.duration, event.xoffset);
        }

        Socket.on('endGame', endGameFunc);
        function endGameFunc(payload) {
            DrawFactory.reset();
            GameFactory.Game.handleGameOver(playerMe, payload.loserId);
            scope.gameover = true;
            scope.$evalAsync();
        }

        Socket.on('playerLeave', playerLeaveFunc);
        function playerLeaveFunc() {
            DrawFactory.reset();
            playerMe.win = true;
            scope.$digest();
        }

        Socket.on('wordHit', wordHitFunc);
        function wordHitFunc(payload) {
            console.log('SOMEONE HIT HIT')
            const playerId = UtilityFactory.stripSocketIdPrefix(payload.playerId);
            if (playerId === playerMe.id) {
                playerMe.incrementStreak();
                if (playerMe.streak % 5 === 0) {
                    Socket.emit('streakWord', { streak: playerMe.streak })
                }
            } else {
                playerRival.incrementStreak();
            }
            scope.$digest();
        }

        Socket.on('wordMiss', wordMissFunc);
        function wordMissFunc(payload) {
            const playerId = UtilityFactory.stripSocketIdPrefix(payload.playerId);
            if (playerId === playerMe.id) {
                playerMe.resetStreak();
            } else {
                playerRival.resetStreak();
            }
            scope.$digest();
        }

        Socket.on('streak', streakFunc);
        function streakFunc(payload) {
            const playerId = UtilityFactory.stripSocketIdPrefix(payload.playerId);
            if (playerId === playerMe.id) {
                playerRival.addWord(payload.text, payload.duration)
                DrawFactory.addWordRival(payload.text, payload.duration, Math.random())
            } else {
                playerMe.addWord(payload.text, payload.duration)
                DrawFactory.addWordMe(payload.text, payload.duration, Math.random())
            }
        }

        // Main game loop.
        function gameLoop() {
            if (!scope.gameover) {
                DrawFactory.updatePositions();
                DrawFactory.removeTimedoutMe(GameFactory.Game.emitGameOver);
                DrawFactory.removeTimedoutRival();
                DrawFactory.removeExpiredMe();
                DrawFactory.removeExpiredRival();
                animationFrameReference = requestAnimationFrame(gameLoop);
            } else {
                endTime = Date.now();
                totalTime = endTime - startTime;
                scope.myWpm = playerMe.wordsPerMinute(totalTime);
                scope.myAccuracy = playerMe.showAccuracy();
                scope.rivalWpm = playerRival.wordsPerMinute(totalTime);
                scope.rivalAccuracy = playerRival.showAccuracy();
            }
        }
    };

    return directive;

});
