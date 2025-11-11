module.exports = (ns) => {
  ns.on('connection', (socket) => {
    // attendance session events
    socket.on('attendance-session-created', (payload) => {
      // broadcast to group room
      if (payload && payload.groupId) ns.to(payload.groupId).emit('attendance-session-created', payload);
    });

    socket.on('qr-code-generated', (payload) => {
      if (payload && payload.sessionId) ns.emit('qr-code-generated', payload);
    });

    socket.on('attendance-marked', (payload) => {
      // payload: { sessionId, studentId, status }
      ns.emit('attendance-marked', payload);
    });
  });
};
