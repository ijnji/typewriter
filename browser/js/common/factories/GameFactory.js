'use strict';

app.factory('GameFactory', function(Socket) {

    let Game = function() {
        this.difficulty = 1
        this.gameTime = 0
    };

    Game.emitGameOver = function() {
        Socket.emit('gameOver');
    }

    Game.handleGameOver = function(playerMe, loserId) {
        if (loserId[0] === '/') {
            loserId = loserId.slice(2, loserId.length);
        }
        playerMe.win = !(playerMe.id === loserId);
    }

    return {
        Game: Game
    }

});
