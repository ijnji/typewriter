'use strict';

app.factory('InputFactory', function(SocketFactory) {
    let Socket = SocketFactory.socket;
    let setWatchKeys = false;

    let watchKeys = function() {
        Socket = SocketFactory.socket;
        if (!setWatchKeys) {
            setWatchKeys = true;
            $(window).keydown(event => {
                Socket.emit('keypress', {key: event.key, id: Socket.id});
            });
        }
    };

    return {
        watchKeys: watchKeys
    }

});
