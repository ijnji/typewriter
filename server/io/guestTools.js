'use strict'
/* jshint loopfunc:true */
const adjectives = require('adjectives');
const _ = require('lodash');
const animals = ['alpaca', 'bunny', 'cat', 'dog', 'elephant', 'fox', 'gorilla', 'hippo', 'iguana', 'jackalope', 'kangaroo', 'kakapo', 'lemur', 'monkey', 'octopus', 'penguin', 'quail', 'racoon', 'sloth', 'tiger', 'vulture', 'walrus', 'xenon', 'yak', 'zebra'];

const nameGenerator = function () {
    const adj = _.sample(adjectives);
    const animal = _.sample(animals);
    const guestName = _.capitalize(adj) + _.capitalize(animal);

    return guestName;
}

const generateUniqueGuestName = function (allSockets) {
    let newGuestName = nameGenerator();
    const socketUsernames = allSockets.filter(socket => socket.request.user.username === newGuestName);
    if (socketUsernames.includes(newGuestName)) {
        return generateUniqueGuestName(allSockets);
    }
    else {
        return newGuestName;
    }

}
const generateAvatarUrl = function (username) {
    const rand = _.random(0, 1);
    const genders = ['male', 'female']
    return `http://eightbitavatar.herokuapp.com/?id=${username}&s=${genders[rand]}&size=150`
}

module.exports = {
    generateUniqueGuestName: generateUniqueGuestName,
    generateAvatarUrl: generateAvatarUrl
}
