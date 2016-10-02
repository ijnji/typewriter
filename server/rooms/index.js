var roomMap = {};
var roomId = 0;
var Room = function(clientId){
  this.roomId = roomId++;
  this.clientIds = [clientId];
  roomMap[this.roomId] = this.clientIds;
}

Room.prototype.addClient = function(clientId){
  this.clientIds.push(clientId);
};

var findSingleClientRoom = function(){
  for (let roomId in roomMap) {
    let clients = roomMap[roomId];
    if (clients.length === 1) {
      return {clientIds: roomMap[roomId], roomId: roomId};
    }
  }
  return false;
}

var findOrCreateRoom = function(clientId){
  let singleClientRoom = findSingleClientRoom();
  if (singleClientRoom) {
    singleClientRoom.clientIds.push(clientId);
    return singleClientRoom.roomId;
  }
  else {
    let newRoom = new Room(clientId);
    return newRoom.roomId;
  }
}

module.exports = {findOrCreateRoom: findOrCreateRoom, roomMap: roomMap};
