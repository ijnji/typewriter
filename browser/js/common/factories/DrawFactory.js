'use strict';

app.factory('DrawFactory', function() {
    let factory = {};

    factory.timestamp = undefined;
    factory.playerMeDrawing = undefined;
    factory.playerMeSprites = [];
    factory.playerRivalDrawing = undefined;
    factory.playerRivalSprites = [];

    window.pmd = factory.playerMeDrawing;
    window.pms = factory.playerMeSprites;
    window.prd = factory.playerRivalDrawing;
    window.prs = factory.playerRivalSprites;

    factory.initialize = function() {
        factory.playerMeDrawing = $('#playerMeDrawing');
        factory.playerRivalDrawing = $('#playerRivalDrawing');
    };

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

    factory.removeExpired = function(callback) {
        let remove = function(sprites) {
            let needToTrim = false;
            for (let i = 0; i < sprites.length; i++) {
                let sTop = sprites[i].posDiv.position().top;
                let sHeight = sprites[i].posDiv.height();
                let sParentHeight = sprites[i].posDiv.parent().height();
                if (sTop >= (sParentHeight - sHeight)) {
                    sprites[i].posDiv.remove();
                    sprites[i] = undefined;
                    needToTrim = true;
                    if (callback) callback();
                }
            }

            if (sprites.length === 0 || !needToTrim) return;

            sprites.sort();
            let newlen = sprites.length;
            while (!sprites[newlen - 1] && newlen > 0) {
                newlen--;
            }
            sprites.length = newlen;
        };

        remove(factory.playerMeSprites);
        remove(factory.playerRivalSprites);
    };

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
    // Prevent words from spawning off the page on the right.
    let sParentWidth = this.posDiv.parent().width();
    if ((xoffset * sParentWidth) + this.posDiv.width() > sParentWidth) {
        xoffset = (sParentWidth - this.posDiv.width()) / sParentWidth;
    }
    this.posDiv.css('left', (xoffset * 90) + '%');
    // TODO: remove Math.random() after server starts varying duration.
    this.speed = Math.random() * (1 / duration);
};