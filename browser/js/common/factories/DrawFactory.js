'use strict';

app.factory('DrawFactory', function() {
    let factory = {};

    factory.timestamp = undefined;
    factory.playerMeDrawing = undefined;
    factory.playerMeSprites = [];
    factory.playerRivalDrawing = undefined;
    factory.playerRivalSprites = [];

    factory.initialize = function() {
        factory.playerMeDrawing = $('#playerMeDrawing');
        window.pmd = factory.playerMeDrawing;
        factory.playerRivalDrawing = $('#playerRivalDrawing');
        window.prd = factory.playerRivalDrawing;
    }

    factory.updatePositions = function() {
        if (!factory.timestamp) {
            factory.timestamp = Date.now();
            return;
        }

        let delta = Date.now() - factory.timestamp;
        factory.timestamp = Date.now();

        let move = function(sprites) {
            sprites.forEach(function(s) {
                let top = s.posDiv.position().top;
                top += s.speed * delta;
                s.posDiv.css('top', top);
            });
        };

        move(factory.playerMeSprites);
        move(factory.playerRivalSprites);
    };

    factory.removeExpired = function() {
    };

        // s.posDiv.style.left = (xoffset * 100) + '%';
        // s.posDiv.style.top = 0 + '%';
        // s.speed = duration / 10; // Percentage of height per millisecond.

    factory.addWordMe = function(text, duration, xoffset) {
        let s = new Sprite(factory.playerMeDrawing);
        s.initialize(text, duration, xoffset);
        factory.playerMeSprites.push(s);
    };

    factory.addWordRival = function(text, duration, xoffset) {
        let s = new Sprite(factory.playerRivalDrawing);
        s.initialize(text, duration, xoffset);
        factory.playerRivalSprites.push(s);
    };

    return factory;
});

// Drawing is expected to be a jQuery element.
function Sprite(drawing) {
    this.posDiv = $('<div class="gameContainerSprite"></div>');
    drawing.append(this.posDiv);
    this.efxDiv = this.posDiv.append('<div></div>');
    this.txtDiv = this.efxDiv.append('<div></div>');
}

Sprite.prototype.initialize = function(text, duration, xoffset) {
    this.txtDiv.html(text);
    this.posDiv.css('left', (xoffset * 90) + '%');
    // TODO: remove Math.random() after server starts varying duration.
    this.speed = Math.random() * (duration / 100);
};