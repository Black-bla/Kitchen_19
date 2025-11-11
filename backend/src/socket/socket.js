// socket.js - initialize socket.io namespaces and attach handlers. Hardened with JWT auth on handshake.
const jwt = require('jsonwebtoken');

function attachAuth(ns) {
  // Middleware to authenticate socket connections using token in handshake.auth or query
  ns.use((socket, next) => {
    try {
      const token = (socket.handshake.auth && socket.handshake.auth.token) ||
                    (socket.handshake.query && socket.handshake.query.token) ||
                    (socket.handshake.headers && socket.handshake.headers.authorization && socket.handshake.headers.authorization.split(' ')[1]);
      if (!token) return next(new Error('Authentication error: token required'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change-me');
      socket.user = decoded; // { id, role }
      return next();
    } catch (err) {
      return next(new Error('Authentication error'));
    }
  });
}

module.exports = (server, io) => {
  try {
    const onlineClassHandler = require('./onlineClass.socket');
    const chatHandler = require('./chat.socket');
    const notificationHandler = require('./notification.socket');
    const attendanceHandler = require('./attendance.socket');

    const onlineNs = io.of('/online-class');
    const chatNs = io.of('/chat');
    const notifNs = io.of('/notifications');
    const attendanceNs = io.of('/attendance');

    // Attach auth middleware to namespaces
    attachAuth(onlineNs);
    attachAuth(chatNs);
    attachAuth(notifNs);
    attachAuth(attendanceNs);

    // Handlers will expect socket.user to exist
    onlineClassHandler(onlineNs);
    chatHandler(chatNs);
    notificationHandler(notifNs);
    attendanceHandler(attendanceNs);
    console.log('Socket namespaces initialized (with auth)');
  } catch (err) {
    console.warn('Failed to initialize socket namespaces:', err.message);
  }
};
