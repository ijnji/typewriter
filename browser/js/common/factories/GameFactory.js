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
        const playerId = "/#" + playerMe.id
        if (playerId === loserId) {
            console.log('i am the loser');
            playerMe.win = false;
        } else {
            console.log('i am in the winner');
            playerMe.win = true;
        }
    }

    return {
        Game: Game
    }

});
