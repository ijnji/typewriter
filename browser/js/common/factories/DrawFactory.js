'use strict';

app.factory('DrawFactory', function() {
    let factory = {};
    let timestamp = undefined;
    let playerMeDrawing = $('#playerMeDrawing');
    let playerMeElems = [];
    let playerRivalDrawing = $('#playerRivalDrawing');
    let playerRivalElems = [];

    factory.updatePositions = function() {
        if (!factory.timestamp) {
            factory.timestamp = Date.now();
            return;
        }

        let delta = Date.now() - factory.timestamp;
        factory.timestamp = Date.now();


    };

    return factory;
});

function DrawObj(text) {
    this.posDiv = $('<div></div>');
    this.efxDiv = this.posDiv.append('<div></div>');
    this.txtDiv = this.efxDiv.append('<div></div>');
    this.txtDiv.text(text);
}
