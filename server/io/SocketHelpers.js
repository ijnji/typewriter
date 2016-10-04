const adjectives = require('adjectives');
const _ = require('lodash');

const animals =  ['alpaca', 'bunny', 'cat', 'dog', 'elephant', 'fox', 'gorilla', 'hippo', 'iguana', 'jackalope', 'kangaroo', 'kakapo', 'lemur', 'monkey', 'octopus', 'penguin', 'quail', 'racoon', 'sloth', 'tiger', 'vulture', 'walrus', 'xenon', 'yak', 'zebra' ];

let activeUsers = [];

const nameGenerator = function(){
        const adj = _.sample(adjectives);
        const animal = _.sample(animals);
        const guestName = adj + _.capitalize(animal);
        return guestName;
    }

module.exports = {

    activeUsers: activeUsers,

    addGuest: function (socket) {
        if (_.findIndex(activeUsers, function (el){
            return el.id === socket.id;
        }) > -1){
            return ;
        } else {
            let userName = nameGenerator();
            while (_.isMatch(activeUsers, {userName: userName})){
                userName = nameGenerator();
            }
            activeUsers.push({id: socket.id, userName: userName})
        }
    },

    addUser: function (socket) {
        console.log('id', socket.id);
        if (_.isMatch(activeUsers, {id: socket.id})) {
            console.log('found user');
            var i = _.findIndex(activeUsers, function (el){
            return el.id === socket.id;
        });
            activeUsers.splice(i, 1);
        }
        activeUsers.push({id: socket.id, userName: socket.request.user.username});
    },

    disconnect: function (socket) {
        var i = _.findIndex(activeUsers, function (el){
            return el.id === socket.id;
        })
        activeUsers.splice(i, 1);
    }

};
