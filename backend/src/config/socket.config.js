const origins = process.env.SOCKET_ORIGINS ? process.env.SOCKET_ORIGINS.split(',') : (process.env.NODE_ENV === 'production' ? [] : ['*']);

module.exports = {
  path: '/socket.io',
  options: {
    cors: {
      origin: origins
    }
  }
};
