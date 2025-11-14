const router = require('express').Router();
const ctrl = require('../controllers/attendance.controller');
const { validate } = require('../middleware/validation.middleware');
const { attendanceSchemas } = require('../utils/validators');
const auth = require('../middleware/auth.middleware');

// Create attendance session
router.post(
  '/session',
  auth,
  validate(attendanceSchemas.createSession),
  ctrl.createSession
);

// Generate QR code for session
router.post('/:id/generate-qr', auth, ctrl.generateQr);

// Mark attendance
router.post(
  '/mark',
  auth,
  validate(attendanceSchemas.markAttendance),
  ctrl.markAttendance
);

// Get attendance records for session (lecturer view)
router.get('/session/:id', auth, ctrl.getSessionAttendance);

// Get student's attendance records
router.get('/student', auth, ctrl.getStudentAttendance);

// Generate attendance report
router.get('/report', auth, ctrl.generateReport);

// Update attendance record (manual marking)
router.put(
  '/session/:sessionId/student/:studentId',
  auth,
  validate(attendanceSchemas.updateRecord),
  ctrl.updateRecord
);

module.exports = router;
