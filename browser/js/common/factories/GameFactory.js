'use strict';

app.factory('GameFactory', function(SocketFactory, UtilityFactory) {
    let Socket = SocketFactory.socket;
    let Game = function() {
        this.difficulty = 1
        this.gameTime = 0
    };

    Game.emitGameOver = function(payload) {
        Socket = SocketFactory.socket;
        Socket.emit('gameOver', payload);
    }

    Game.handleGameOver = function(playerMe, playerRival, meInfo, rivalInfo, loserId, totalTime) {
        console.log('GAME ALREADY OVER', loserId);
        Socket = SocketFactory.socket;
        loserId = UtilityFactory.stripSocketIdPrefix(loserId);
        playerMe.win = !(playerMe.id === loserId);
        if (playerMe.win) {
            Socket.emit('saveMatchData', {
                winnerStats: playerMe,
                loserStats: playerRival,
                winnerInfo: meInfo,
                loserInfo: rivalInfo,
                duration: totalTime
            })
        }
    }
    return {
        Game: Game
    }
});
