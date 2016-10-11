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
        console.log('playerMe.id: ', playerMe.id);
        console.log('loserId: ', loserId);
        if (playerMe.id[0] === '/') {
            playerMe.id = playerMe.id.splice(0, 2);
        }
        playerMe.win = playerMe.id === loserId;
    }

    return {
        Game: Game
    }

});
