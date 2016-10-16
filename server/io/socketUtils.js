function getAllRoomMembers(room, io) {
    const socketIds = Object.keys(io.nsps['/'].adapter.rooms[room].sockets);
    const sockets = socketIds.map(id => io.sockets.connected[id]);
    return sockets;
}

module.exports = {
    getAllRoomMembers: getAllRoomMembers
}
