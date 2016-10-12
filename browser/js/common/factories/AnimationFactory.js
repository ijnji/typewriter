'use strict';

// This factory should only be used by DrawFactory.

app.factory('AnimationFactory', function() {

    let factory = {};

    factory.addStrikethrough = function(sprite) {
        let ani = $('<div></div>');
        sprite.efxDiv.append(ani);
        ani.css('position', 'absolute');
        ani.css('left', '-25%');
        ani.css('transform', 'rotate(' + (Math.random() * 20 - 10) + 'deg)');
        ani.css('width', '0%');
        ani.css('border-top', '5px solid black');
        ani.css('top', '50%');
        ani.animate({
            width: '150%'
        }, 250, function() {
            sprite.expired = true;
        });
    };

    return factory;

});
