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
        // const playerMeId = '/#' + playerMe.id
        if (playerMe.id === loserId) {
            playerMe.win = false;
        } else {
            playerMe.win = true;
        }
    }

    return {
        Game: Game
    }

});
