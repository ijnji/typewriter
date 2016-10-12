'use strict';

app.factory('UtilityFactory', function() {
    const ALPHABET = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
    ];

    function stripSocketIdPrefix(socketId){
        if(socketId[0] === '/'){
            return socketId.slice(2,socketId.length);
        }
        return socketId;
    }
    return {
        ALPHABET: ALPHABET,
        stripSocketIdPrefix: stripSocketIdPrefix
    };
});
