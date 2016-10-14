'use strict';

app.factory('GameFactory', function(Socket, UtilityFactory) {

    let Game = function() {
        this.difficulty = 1
        this.gameTime = 0
    };

    Game.emitGameOver = function() {
        Socket.emit('gameOver');
    }

    Game.handleGameOver = function(playerMe, loserId) {
        loserId = UtilityFactory.stripSocketIdPrefix(loserId);
        playerMe.win = !(playerMe.id === loserId);
    }
    return {
        Game: Game
    }
});
