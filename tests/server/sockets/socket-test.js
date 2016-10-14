// var sinon = require('sinon');
// var expect = require('chai').expect;
var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://localhost:1337';

var options = {
  transports: ['websocket'],
  'force new connection': true
};

describe('Sockets', function () {
    var client1, client2, client3, activeUsers;

    xit('Should broadcast new user to all users', function(done){
          var client1 = io.connect(socketURL, options);
          console.log('in should broadcast it statement');
          client1.on('connect', function(data){
            console.log('on connection')
            client1.emit('setUsername', {username: 'RestlessBunny'});
            console.log('emitted', activeUsers);
            /* Since first client is connected, we connect
            the second client. */

            client.on('addGuest', function () {
                console.log('in addGuest');
            })

          });

          var numUsers = 0;
          client1.on('new user', function(usersName){
            numUsers += 1;

            if(numUsers === 2){
              usersName.should.equal(chatUser2.name + " has joined.");
              client1.disconnect();
              done();
            }
          });
        });
})
//Steps
    //1. set up connections using socket.io-client
    //2. set up event listeners
    //3. trigger all emit events
    //4. disconnect all client connections
