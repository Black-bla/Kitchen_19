/** PM2 process file (optional) */
module.exports = {
  apps: [
    {
      name: 'kitchen19-backend',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
