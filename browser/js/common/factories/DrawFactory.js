'use strict';

app.factory('DrawFactory', function(AnimationFactory) {

    let factory = {};

    factory.timestamp = undefined;

    // Div container for sprites.
    factory.playerMeDrawing = undefined;
    factory.playerRivalDrawing = undefined;

    // All sprite objects.
    // Their positions are changed each game loop to implement
    // the following animation.
    factory.playerMeSprites = [];
    factory.playerRivalSprites = [];

    // Words may need to play an animation before they
    // disappear on a word hit.
    factory.playerMeSpritesExpiring = [];
    factory.playerRivalSpritesExpiring = [];

    factory.initialize = function() {
        factory.playerMeDrawing = $('#playerMeDrawing');
        factory.playerRivalDrawing = $('#playerRivalDrawing');
    };

    factory.reset = function() {
        factory.playerMeSprites = [];
        factory.playerRivalSprites = [];
        factory.playerMeSpritesExpiring = [];
        factory.playerRivalSpritesExpiring = [];
    };

    factory.updatePositions = function() {
        if (!factory.timestamp) {
            factory.timestamp = Date.now();
            return;
        }

        let delta = Date.now() - factory.timestamp;
        factory.timestamp = Date.now();

        const move = function(sprites) {
            sprites.forEach(function(s) {
                let top = s.posDiv.position().top;
                top += s.speed * delta;
                s.posDiv.css('top', top);
            });
        };

        move(factory.playerMeSprites);
        move(factory.playerRivalSprites);
    };

    // Removes any undefined entries in given sprite array.
    const trim = function(sprites) {
        sprites.sort();
        let newlen = sprites.length;
        while (!sprites[newlen - 1] && newlen > 0) {
            newlen--;
        }
        sprites.length = newlen;
    };

    const removeTimedout = function(sprites, callback) {
        if (sprites.length === 0) return;
        let toTrim = false;
        for (let i = 0; i < sprites.length; i++) {
            let sTop = sprites[i].posDiv.position().top;
            let sHeight = sprites[i].posDiv.height();
            let sParentHeight = sprites[i].posDiv.parent().height();
            if (sTop >= (sParentHeight - sHeight)) {
                sprites[i].posDiv.remove();
                sprites[i] = undefined;
                toTrim = true;
                if (callback) callback();
            }
        }
        if (toTrim) trim(sprites);
    };

    factory.removeTimedoutMe = function(callback) {
        removeTimedout(factory.playerMeSprites, callback);
    }

    factory.removeTimedoutRival = function(callback) {
        removeTimedout(factory.playerRivalSprites, callback);
    }

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

    const removeWord = function(sprites, expiring, text) {
        let idx = -1;
        for (let i = 0; i < sprites.length; i++) {
            if (sprites[i].txtDiv.html() === text) {
                idx = i;
                AnimationFactory.addStrikethrough(sprites[i]);
                expiring.push(sprites[i]);
                //sprites[i].posDiv.remove();
            }
        }
        if (idx > -1) {
            sprites.splice(idx, 1);
        }
    };

    factory.removeWordMe = function(text) {
        removeWord(
            factory.playerMeSprites,
            factory.playerMeSpritesExpiring,
            text
        );
    };

    factory.removeWordRival = function(text) {
        removeWord(
            factory.playerRivalSprites,
            factory.playerRivalSpritesExpiring,
            text
        );
    };

    factory.removeExpired = function(expiring) {
        let idx = -1;
        for (let i = 0; i < expiring.length; i++) {
            if (expiring[i].expired) {
                idx = i;
                expiring[i].posDiv.remove();
            }
        }
        if (idx > -1) {
            expiring.splice(idx, 1);
        }
    };

    factory.removeExpiredMe = function() {
        factory.removeExpired(factory.playerMeSpritesExpiring);
    };

    factory.removeExpiredRival = function() {
        factory.removeExpired(factory.playerRivalSpritesExpiring);
    };

    return factory;

});

// Drawing is expected to be a jQuery element.
function Sprite(drawing) {
    this.expired = false;
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
    this.posDiv.css('left', (xoffset * 95) + '%');
    this.speed = (1 / duration);
};
