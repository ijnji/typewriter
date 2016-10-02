var roomMap = {};
var roomId = 0;
var Room = function(){
  this.roomId = roomId++;
  this.clientIds = [];
  roomMap[this.roomId] = this.clientIds;
}

Room.prototype.addClient = function(clientId){
  this.clientIds.push(clientId);
};

roomMap.findRoom = function(clientId){
  for (let roomId in roomMap) {
    let clients = roomMap[roomId];
    if(clients.length )
  }
}
var findSingleClientRoom = function(){
  for (let roomId in roomMap) {
    let clients = roomMap[roomId];
    if(clients.length === 1){
      return roomMap[roomId];
    }
  }
}
