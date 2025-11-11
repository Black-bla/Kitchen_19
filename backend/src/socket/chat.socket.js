module.exports = (ns) => {
  ns.on('connection', (socket) => {
    socket.on('join-room', ({ roomId, userId }) => {
      if (roomId) socket.join(roomId);
    });

    socket.on('send-message', ({ roomId, message, userId }) => {
      if (roomId) ns.to(roomId).emit('receive-message', { roomId, message, userId, timestamp: Date.now() });
    });

    socket.on('typing', (payload) => {
      if (payload && payload.roomId) ns.to(payload.roomId).emit('typing', payload);
    });

    socket.on('stop-typing', (payload) => {
      if (payload && payload.roomId) ns.to(payload.roomId).emit('stop-typing', payload);
    });
  });
};
