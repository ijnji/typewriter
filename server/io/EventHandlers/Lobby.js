const io = ('../index.js');
const adjectives = require('adjectives');
const _ = require('lodash');


const Lobby = function(app, socket, io, activeUsers){
    this.activeUsers = activeUsers;
    this.app = app;
    this.socket = socket;
    this.io = io;
    this.handler = {
        addGuest: addGuest.bind(this),
        addUser: addUser.bind(this),
        getUsers: getUsers.bind(this),
        challengeUser: challengeUser.bind(this)
    }
}

const animals =  ['alpaca', 'bunny', 'cat', 'dog', 'elephant', 'fox', 'gorilla', 'hippo', 'iguana', 'jackalope', 'kangaroo', 'kakapo', 'lemur', 'monkey', 'octopus', 'penguin', 'quail', 'racoon', 'sloth', 'tiger', 'vulture', 'walrus', 'xenon', 'yak', 'zebra' ];



const nameGenerator = function(){
        const adj = _.sample(adjectives);
        const animal = _.sample(animals);
        const guestName = adj + _.capitalize(animal);
        return guestName;
    }

const addGuest = function () {
    const self = this;
    if (_.findIndex(this.activeUsers, function (el){
        return el.id === self.socket.id;
    }) > -1){
        return ;
    } else {
        let userName = nameGenerator();
        while (_.isMatch(this.activeUsers, {userName: userName})){
            userName = nameGenerator();
        }
        this.activeUsers.push({id: this.socket.id, userName: userName, playing: false})
    }
    console.log(this.activeUsers);
};

const addUser = function () {
    const self = this;
    if (_.isMatch(this.activeUsers, {id: this.socket.id})) {
        var i = _.findIndex(this.activeUsers, function (el){
        return el.id === self.socket.id;
    });
        this.activeUsers.splice(i, 1);
    }
    this.activeUsers.push({id: this.socket.id, userName: this.socket.request.user.username, playing: false});
};

// const removeUser = function () {
//     const self = this;
//     var i = _.findIndex(this.activeUsers, function (el){
//         return el.id === self.socket.id;
//     })
//     this.activeUsers.splice(i, 1);
// };

const getUsers = function(){
    this.io.emit('users', {users: this.activeUsers});
}

const challengeUser = function(socketid){
    const id = socketid.id;
    this.io.to(id).emit( 'sendingmsg', {sender : this.socket.id} );
}

module.exports = Lobby;
