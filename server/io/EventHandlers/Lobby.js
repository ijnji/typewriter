const io = ('../index.js');
const adjectives = require('adjectives');
const _ = require('lodash');


const Lobby = function(app, socket, io){
    this.app = app;
    this.socket = socket;
    this.io = io;
    this.handler = {
        addGuest: addGuest.bind(this),
        addUser: addUser.bind(this),
        removeUser: removeUser.bind(this),
        getUsers: getUsers.bind(this)
    }
}

const animals =  ['alpaca', 'bunny', 'cat', 'dog', 'elephant', 'fox', 'gorilla', 'hippo', 'iguana', 'jackalope', 'kangaroo', 'kakapo', 'lemur', 'monkey', 'octopus', 'penguin', 'quail', 'racoon', 'sloth', 'tiger', 'vulture', 'walrus', 'xenon', 'yak', 'zebra' ];

let activeUsers = [];

const nameGenerator = function(){
        const adj = _.sample(adjectives);
        const animal = _.sample(animals);
        const guestName = adj + _.capitalize(animal);
        return guestName;
    }



const addGuest = function () {
    // console.log(activeUsers);
    console.log('THIS', this);
    // console.log(this.socket);
    const self = this;
    if (_.findIndex(activeUsers, function (el){
        return el.id === self.socket.id;
    }) > -1){
        return ;
    } else {
        let userName = nameGenerator();
        while (_.isMatch(activeUsers, {userName: userName})){
            userName = nameGenerator();
        }
        activeUsers.push({id: this.socket.id, userName: userName})
    }
    console.log(activeUsers);
};

const addUser = function () {
    console.log('id', this.socket.id);
    const self = this;
    if (_.isMatch(activeUsers, {id: this.socket.id})) {
        console.log('found user');
        var i = _.findIndex(activeUsers, function (el){
        return el.id === self.socket.id;
    });
        activeUsers.splice(i, 1);
    }
    activeUsers.push({id: this.socket.id, userName: this.socket.request.user.username});
};

const removeUser = function () {
    const self = this;
    var i = _.findIndex(activeUsers, function (el){
        return el.id === self.socket.id;
    })
    activeUsers.splice(i, 1);
};

const getUsers = function(){
    this.io.emit('users', {users: activeUsers});
}


module.exports = Lobby;
