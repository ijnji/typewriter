// var sinon = require('sinon');
var expect = require('chai').expect;
var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://localhost:1337';

var options = {
  transports: ['websocket'],
  'force new connection': true
};

describe('Sockets', function () {
    var client1, client2;


    it('Should broadcast new user to all users', function(done){
          client1 = io.connect(socketURL, options);

          console.log('in should broadcast it statement');
          client1.on('setUsername', function(data){
            console.log('here before we do stuff');
            expect(data).to.equal({username: 'RestlessBunny'});
          console.log('heyyeyeyeyeyeye')
            client1.disconnect();
            done();
          });
          // client2. = i
            // console.log('on connection')
            // client1.emit('setUsername', {username: 'RestlessBunny'});
            // console.log('emitted', activeUsers);
            //  Since first client is connected, we connect
            // the second client.

            // client.on('addGuest', function () {
            //     console.log('in addGuest');
            // })

        });
})
//Steps
    //1. set up connections using socket.io-client
    //2. set up event listeners
    //3. trigger all emit events
    //4. disconnect all client connections
