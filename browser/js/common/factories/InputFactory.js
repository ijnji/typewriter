'use strict';

app.factory('InputFactory', function(Socket) {
  let watchKeys = function(){
    $(window).keydown(event => {
      Socket.emit('eveClnKey', {key: event.key});
    })
  }
  return {
    watchKeys: watchKeys
  }
});
