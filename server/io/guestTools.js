'use strict'
const adjectives = require('adjectives');
const _ = require('lodash');
const animals = ['alpaca', 'bunny', 'cat', 'dog', 'elephant', 'fox', 'gorilla', 'hippo', 'iguana', 'jackalope', 'kangaroo', 'kakapo', 'lemur', 'monkey', 'octopus', 'penguin', 'quail', 'racoon', 'sloth', 'tiger', 'vulture', 'walrus', 'xenon', 'yak', 'zebra'];

const nameGenerator = function(activeUsers){
    const adj = _.sample(adjectives);
    const animal = _.sample(animals);
    const guestName = _.capitalize(adj) + _.capitalize(animal);

    return guestName;
}

const generateUniqueGuestName = function(io){
    let newGuestName = nameGenerator();
    const sockets = io.sockets.clients();
    for(let i = 0; i < sockets.length; i++){
        if(sockets[i].request.user.username === newGuestName);
    }
    // while (_.isMatch(this.activeUsers, { username: newGuestName })) {
    //     newGuestName = nameGenerator();
    // }
    return newGuestName;
}


module.exports = {
    nameGenerator: nameGenerator
}
