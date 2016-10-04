'use strict';

app.factory('GameFactory', function(Socket) {

    let Game = function() {
        this.difficulty = 1
        this.gameTime = 0
    };

    Game.emitGameOver = function() {
        Socket.emit('eveClnGameOver');
    }
    
    Game.handleGameOver = function(playerMe, loserId) {
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
