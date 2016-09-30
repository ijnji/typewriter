'use strict';

app.factory('PlayerFactory', function() {
    let factory = {};

    factory.Player = function() {
        this.currLetter = undefined;
        this.currLeft = undefined;
        this.currRight = undefined;
        this.activePool = {};
        this.wordPool = {};
    }

    return factory;
});

