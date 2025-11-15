const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const Sentry = require('@sentry/node');
const app = express();
const rateLimiter = require('./middleware/rateLimiter.middleware');
const logger = require('./middleware/logger.middleware');

// Body parser with reasonable default limit; override with BODY_LIMIT env var
app.use(express.json({ limit: process.env.BODY_LIMIT || '1mb' }));

// Security headers
app.use(helmet());

// CORS: in production restrict to allowed origins via CORS_ORIGINS env var (comma-separated)
const corsOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : (process.env.NODE_ENV === 'production' ? [] : '*');
const corsOptions = {
	origin: corsOrigins,
	optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Logging middleware
app.use(logger);
// Rate limiting middleware (apply globally or to sensitive routes)
app.use(rateLimiter);

// Health route
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Test error route for Sentry
app.get('/api/test-error', (req, res) => {
	throw new Error('Test error for Sentry monitoring');
});

// Root route - helpful for browsers visiting the base URL
app.get('/', (req, res) => {
	res.json({
		status: 'ok',
		message: 'kitchen19 backend',
		docs: '/api',
		health: '/api/health'
	});
});

// Route mounts
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const institutionRoutes = require('./routes/institution.routes');
const groupRoutes = require('./routes/group.routes');
const courseRoutes = require('./routes/course.routes');
const timetableRoutes = require('./routes/timetable.routes');
const documentRoutes = require('./routes/document.routes');
const assignmentRoutes = require('./routes/assignment.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const onlineClassRoutes = require('./routes/onlineClass.routes');
const notificationRoutes = require('./routes/notification.routes');
const aiRoutes = require('./routes/ai.routes');
const socialRoutes = require('./routes/social.routes');
const marketplaceRoutes = require('./routes/marketplace.routes');
const paymentRoutes = require('./routes/payment.routes');
const testRoutes = require('./routes/test.routes');
const adminRoutes = require('./routes/admin.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/online-classes', onlineClassRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/test', testRoutes);
app.use('/api/admin', adminRoutes);

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

// Error handler (should be last)
const errorHandler = require('./middleware/error.middleware');
app.use(errorHandler);

module.exports = app;
