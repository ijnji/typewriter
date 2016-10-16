app.directive('typewriter', function(PlayerFactory, InputFactory, GameFactory, DrawFactory, SocketFactory, SocketService, UtilityFactory, $rootScope) {
    let directive = {};
    directive.restrict = 'E';
    directive.scope = {};
    directive.templateUrl = 'js/common/directives/typewriter/typewriter.html';

    directive.link = function(scope) {
        let Socket = SocketFactory.socket;
        scope.$on('refreshedSocket', function(event, data) {
            Socket = data.socket;
        });

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
        scope.rivalInfo = SocketService.getRival();
        console.log('scope.rivalInfo',scope.rivalInfo)

        scope.$on('$destroy', function() {
            window.cancelAnimationFrame(animationFrameReference);
            Socket.removeListener('newKey', newKeyFunc);
            Socket.removeListener('newWord', newWordFunc);
            Socket.removeListener('endGame', endGameFunc);
            Socket.removeListener('playerLeave', playerLeaveFunc);
            Socket.removeListener('wordHit', wordHitFunc);
            Socket.removeListener('wordMiss', wordMissFunc);
            Socket.removeListener('streak', streakFunc);
            DrawFactory.reset();
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
                    // Handle sounds on socket inbound events.
                    AudioFactory.playFile('backspace');

                    playerMe.removeChar();
                } else if (payload.key.charCodeAt(0) >= 97 && payload.key.charCodeAt(0) <= 122) {
                    // Handle sounds on socket inbound events.
                    AudioFactory.playFile('singletype');

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
            endTime = Date.now();
            totalTime = endTime - startTime;
            console.log('rootScopeUser', $rootScope.rootScopeUser);
            GameFactory.Game.handleGameOver(playerMe, playerRival, $rootScope.rootScopeUser, scope.rivalInfo, payload.loserId, totalTime);
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
            const playerId = UtilityFactory.stripSocketIdPrefix(payload.playerId);
            if (playerId === playerMe.id) {

                // Handle sounds on socket inbound events.
                AudioFactory.playFile('carriagereturn');

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
                count -= 1
            } else {
                playerMe.addWord(payload.text, payload.duration)
                DrawFactory.addWordMe(payload.text, payload.duration, Math.random())
            }
        }

        // Main game loop.
        function gameLoop() {
            if (!scope.gameover) {
                DrawFactory.updatePositions();
                DrawFactory.removeTimedoutMe(GameFactory.Game.emitGameOver, {rivalSocketId: scope.rivalInfo.socketId});
                DrawFactory.removeTimedoutRival();
                DrawFactory.removeExpiredMe();
                DrawFactory.removeExpiredRival();
                animationFrameReference = requestAnimationFrame(gameLoop);
            } else {
                // endTime = Date.now();
                // totalTime = endTime - startTime;
                // scope.myWpm = playerMe.wordsPerMinute(totalTime);
                // scope.myAccuracy = playerMe.showAccuracy();
                // scope.rivalWpm = playerRival.wordsPerMinute(totalTime);
                // scope.rivalAccuracy = playerRival.showAccuracy();
                // scope.myLongestStreak = playerMe.getLongestStreak();
                // scope.rivalLongestStreak = playerRival.getLongestStreak();
            }
        }
    };

    return directive;

});
