module.exports = (ns) => {
  ns.on('connection', (socket) => {
    socket.on('subscribe-notifications', ({ userId }) => {
      if (userId) socket.join(`user:${userId}`);
    });

    socket.on('new-notification', (notification) => {
      // If target.users present, emit to each; if group present, emit to group room
      if (notification && notification.target) {
        if (notification.target.users && Array.isArray(notification.target.users)) {
          notification.target.users.forEach((u) => ns.to(`user:${u}`).emit('new-notification', notification));
        } else if (notification.target.group) {
          ns.to(`group:${notification.target.group}`).emit('new-notification', notification);
        } else {
          ns.emit('new-notification', notification);
        }
      }
    });

    socket.on('notification-read', ({ notificationId, userId }) => {
      if (userId) ns.to(`user:${userId}`).emit('notification-read', { notificationId });
    });
  });
};
