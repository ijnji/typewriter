'use strict';

app.factory('InputFactory', function() {
    let factory = {};
    factory.gOne = document.getElementById('gameOne');
    factory.gTwo = document.getElementById('gameTwo');

    document.body.addEventListener('keypress', factory.onPress);

    factory.onPress = function(e) {
        console.log('key pressed');
        let char = e.key;
        factory.gOne.innerHTML += char;
        factory.gTwo.innerHTML += char;
    };

    return factory;
});