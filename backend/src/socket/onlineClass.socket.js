module.exports = (ns) => {
  ns.on('connection', (socket) => {
    socket.on('join-class', ({ classId, userId }) => {
      if (classId) {
        socket.join(classId);
        ns.to(classId).emit('participant-joined', { userId });
      }
    });

    socket.on('leave-class', ({ classId, userId }) => {
      if (classId) {
        socket.leave(classId);
        ns.to(classId).emit('participant-left', { userId });
      }
    });

    socket.on('class-started', ({ classId }) => ns.to(classId).emit('class-started', { classId }));
    socket.on('class-ended', ({ classId }) => ns.to(classId).emit('class-ended', { classId }));
    socket.on('raise-hand', (payload) => ns.to(payload.classId).emit('raise-hand', payload));
    socket.on('lower-hand', (payload) => ns.to(payload.classId).emit('lower-hand', payload));
  });
};
