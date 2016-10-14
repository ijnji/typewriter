'use strict';

app.factory('InputFactory', function(Socket) {
    let setWatchKeys = false;

    let watchKeys = function() {
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
