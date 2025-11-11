require('dotenv').config();

// Sentry error monitoring
const Sentry = require('@sentry/node');
Sentry.init({
  dsn: process.env.SENTRY_DSN || 'https://your-backend-dsn@sentry.io/project-id',
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 1.0,
});

const app = require('./src/app');
const http = require('http');
const connectDB = require('./src/config/database');
const socketConfig = require('./src/config/socket.config');
const socketInit = require('./src/socket/socket');

const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

(async () => {
  try {
    // Fail fast: validate critical environment variables before starting.
    const requiredAlways = ['MONGO_URI', 'JWT_SECRET'];
    const missingAlways = requiredAlways.filter(k => !process.env[k]);
    if (missingAlways.length) {
      console.error('Missing required environment variables:', missingAlways.join(', '));
      process.exit(1);
    }
    if (process.env.NODE_ENV === 'production') {
      const requiredProd = ['CLERK_SECRET_KEY', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
      const missingProd = requiredProd.filter(k => !process.env[k]);
      if (missingProd.length) {
        console.error('Missing required production environment variables:', missingProd.join(', '));
        process.exit(1);
      }
    }
    // Connect to MongoDB
    await connectDB();

    // Initialize socket.io and any socket namespaces
    const { Server } = require('socket.io');
    const io = new Server(server, socketConfig.options || {});

    // If REDIS_URL is provided, try to wire the Redis adapter for horizontal scaling
    if (process.env.REDIS_URL) {
      try {
        const { createAdapter } = require('@socket.io/redis-adapter');
        const { createClient } = require('redis');
        // createClient from redis v4
        const pubClient = createClient({ url: process.env.REDIS_URL });
        const subClient = pubClient.duplicate();
        (async () => {
          await pubClient.connect();
          await subClient.connect();
          io.adapter(createAdapter(pubClient, subClient));
          console.log('Socket.IO Redis adapter enabled');
        })().catch((e) => {
          console.warn('Failed to initialize Redis adapter:', e.message || e);
        });
      } catch (e) {
        console.warn('Redis adapter packages not installed or failed to load. To enable clustering install @socket.io/redis-adapter and redis.');
      }
    }

    // pass server and io to socket initializer (stub)
    try { socketInit(server, io); } catch (e) { console.warn('socket init skipped:', e.message); }

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
