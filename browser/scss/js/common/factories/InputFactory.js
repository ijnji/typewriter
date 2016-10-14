'use strict';

app.factory('InputFactory', function(Socket) {

    let watchKeys = function() {
        $(window).keydown(event => {
            Socket.emit('keypress', {key: event.key, id: Socket.id});
        })
    }

    return {
        watchKeys: watchKeys
    }

});
