'use strict'
app.directive('typewriter', function(PlayerFactory, InputFactory, GameFactory, DrawFactory, Socket) {

    let directive = {};

    directive.restrict = 'E';
    directive.scope = {};
    directive.templateUrl = 'js/common/directives/typewriter/typewriter.html';

    directive.link = function(scope) {

        InputFactory.watchKeys();
        let gameTime = 0
        var levelWordsKeysMe = []
        var levelWordsKeysRival = []
        scope.level = 0

        Socket.on('activeWords', function(payload) {
            console.log("hello")

            playerMe.levelWords = payload.player1Words 
            playerRival.levelWords = payload.player2Words

            
            console.log("level", playerMe.levelWords, playerRival.levelWords)
            console.log("active", playerMe.activeWords, playerRival.activeWords)
            

            Socket.emit('forArray', {playerMe: playerMe.levelWords, playerRival: playerRival.levelWords})

            
            
            
        })


        Socket.on('makeArray', function(payload) {

            
            levelWordsKeysMe = payload.playerMe123
             levelWordsKeysRival = payload.playerRival123
             playerMe.activeWords = playerMe.levelWords[levelWordsKeysMe[0]]
            playerRival.activeWords = playerRival.levelWords[levelWordsKeysRival[0]]
              console.log("look at me",levelWordsKeysMe)
             let counter = 0
            
            let nextMiniWave = levelWordsKeysMe[counter]
            console.log("MINI WAVE", nextMiniWave)
            let wordsInterval = setInterval(function() {
                gameTime++
                console.log(gameTime, nextMiniWave)
                if(gameTime > 60) {
                    
                    gameTime = 0
                    scope.level++
                    nextMiniWave = 0
                    console.log(scope.level)
                    clearInterval(wordsInterval)
                    Socket.emit('readyForActiveWords', {level: scope.level})
                }

                else if(gameTime > nextMiniWave) {
                    console.log("COUNTER",levelWordsKeysMe[counter], nextMiniWave)
                    console.log(playerMe.activeWords)
                    counter++
                    nextMiniWave = parseInt(nextMiniWave) + parseInt(levelWordsKeysMe[counter])
                    
                    playerMe.activeWords[nextMiniWave] = playerMe.levelWords[levelWordsKeysMe[counter]]
                }

                // console.log(playerMe.activeWords)

            }, 1000)
        })

        
        


        Socket.emit('readyForActiveWords',{level:1})


        $(document).ready(function() {
            DrawFactory.initialize();
            InputFactory.watchKeys();
        });


        let playerMe = new PlayerFactory.Player(Socket.io.engine.id);
        let playerRival = new PlayerFactory.Player();
        let theGame = new GameFactory.Game();




        scope.me = playerMe;
        scope.rival = playerRival;
        
        const timeStart = Date.now();
        requestAnimationFrame(gameLoop);

        Socket.on('newKey', function(payload) {
            if (playerMe.id === payload.id) {
                if (payload.key === 'Enter') {
                    console.log(payload.key);
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

        Socket.on('eveSrvWord', function(payload) {
            playerMe.addWord(payload.text, payload.duration);
            DrawFactory.addWordMe(payload.text, payload.duration, payload.xoffset);

            playerRival.addWord(payload.text, payload.duration);
            DrawFactory.addWordRival(payload.text, payload.duration, payload.xoffset);

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
        function gameLoop() {
            DrawFactory.updatePositions();
            DrawFactory.removeExpiredMe(function() { });
            DrawFactory.removeExpiredRival(function() { });
            requestAnimationFrame(gameLoop);
            // For loss, use the following.
            //theGame.emitGameOver();
        }
    };

    return directive;

});
