const Attendance = require('../models/Attendance');
const { attendanceSchemas } = require('../utils/validators');
const { send } = require('../services/notification.service');
const { isWithinRadius } = require('../services/geolocation.service');
const QRCode = require('qrcode');

module.exports = {
  // Create attendance session
  createSession: async (req, res) => {
    try {
      const { error, value } = attendanceSchemas.createSession.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      // Check if user is lecturer or admin
      if (req.user.role !== 'lecturer' && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only lecturers can create attendance sessions'
        });
      }

      // Check if session already exists for this date and subject/group
      const existingSession = await Attendance.findOne({
        subject: value.subject,
        group: value.group,
        date: {
          $gte: new Date(value.date).setHours(0, 0, 0, 0),
          $lt: new Date(value.date).setHours(23, 59, 59, 999)
        }
      });

      if (existingSession) {
        return res.status(400).json({
          success: false,
          message: 'Attendance session already exists for this date'
        });
      }

      // Normalize location keys to match Attendance model ({ lat, lng, radius })
      if (value.location) {
        const loc = value.location;
        value.location = {
          lat: loc.latitude !== undefined ? loc.latitude : loc.lat,
          lng: loc.longitude !== undefined ? loc.longitude : loc.lng,
          radius: loc.radius
        };
      }

      const attendance = new Attendance({
        ...value,
        lecturer: req.user.id
      });

      await attendance.save();

      // Notify students
      await send({
        title: 'New Attendance Session',
        body: `${value.classType === 'physical' ? 'Physical' : 'Online'} class attendance is now open`,
        type: 'attendance',
        recipients: value.group,
        data: { attendanceId: attendance._id }
      });

      res.status(201).json({
        success: true,
        message: 'Attendance session created successfully',
        data: attendance
      });
    } catch (error) {
      console.error('Create attendance session error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create attendance session',
        error: error.message
      });
    }
  },

  // Generate QR code for attendance
  generateQr: async (req, res) => {
    try {
      const { id } = req.params;

      const attendance = await Attendance.findById(id);
      if (!attendance) {
        return res.status(404).json({
          success: false,
          message: 'Attendance session not found'
        });
      }

      // Check if user is authorized
      if (attendance.lecturer.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to generate QR for this session'
        });
      }

      // Generate QR code data
      const qrData = {
        attendanceId: attendance._id,
        timestamp: Date.now(),
        expiry: Date.now() + (15 * 60 * 1000) // 15 minutes
      };

      const qrString = JSON.stringify(qrData);
      const qrCodeDataURL = await QRCode.toDataURL(qrString);

      // Update attendance with QR info
      attendance.qrCode = qrString;
      attendance.qrExpiry = new Date(qrData.expiry);
      await attendance.save();

      res.json({
        success: true,
        data: {
          qrCode: qrCodeDataURL,
          expiry: qrData.expiry,
          attendanceId: attendance._id
        }
      });
    } catch (error) {
      console.error('Generate QR error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate QR code',
        error: error.message
      });
    }
  },

  // Mark attendance
  markAttendance: async (req, res) => {
    try {
      const { error, value } = attendanceSchemas.markAttendance.validate(req.body);
      if (error) {
        console.error('markAttendance validation failed:', error.details, 'req.body:', req.body);
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      const attendance = await Attendance.findById(value.attendanceId);
      if (!attendance) {
        return res.status(404).json({
          success: false,
          message: 'Attendance session not found'
        });
      }

      // Check if QR code is still valid
      if (attendance.qrExpiry && new Date() > attendance.qrExpiry) {
        return res.status(400).json({
          success: false,
          message: 'QR code has expired'
        });
      }

      // Check location for physical classes
      if (attendance.classType === 'physical' && attendance.location) {
        const studentLocation = { lat: value.lat !== undefined ? value.lat : value.latitude, lon: value.lon !== undefined ? value.lon : value.longitude };
        const classLocation = { lat: attendance.location.lat !== undefined ? attendance.location.lat : attendance.location.latitude, lon: attendance.location.lng !== undefined ? attendance.location.lng : attendance.location.longitude };
        const isWithinRange = isWithinRadius(
          studentLocation,
          classLocation,
          attendance.location.radius / 1000 // Convert meters to km
        );

        if (!isWithinRange) {
          return res.status(400).json({
            success: false,
            message: 'You are not within the required location for this class'
          });
        }
      }

      // Check if student already marked attendance
      const existingRecord = attendance.records.find(
        record => record.student.toString() === req.user.id
      );

      if (existingRecord) {
        return res.status(400).json({
          success: false,
          message: 'Attendance already marked for this session'
        });
      }

      // Add attendance record
      attendance.records.push({
        student: req.user.id,
        status: 'present',
        markedAt: new Date(),
        markedBy: 'qr',
        location: attendance.classType === 'physical' ? { lat: value.lat !== undefined ? value.lat : value.latitude, lng: value.lon !== undefined ? value.lon : value.longitude } : undefined
      });

      await attendance.save();

      res.json({
        success: true,
        message: 'Attendance marked successfully'
      });
    } catch (error) {
      console.error('Mark attendance error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark attendance',
        error: error.message
      });
    }
  },

  // Get attendance records for a session
  getSessionAttendance: async (req, res) => {
    try {
      const { id } = req.params;

      const attendance = await Attendance.findById(id)
        .populate('subject', 'name code')
        .populate('group', 'name')
        .populate('lecturer', 'name email')
        .populate('records.student', 'name email studentId');

      if (!attendance) {
        return res.status(404).json({
          success: false,
          message: 'Attendance session not found'
        });
      }

      // Check if user is authorized (lecturer or admin)
      // Debug: log lecturer id and requester id to diagnose mismatches
      const attendanceLecturerId = attendance.lecturer && attendance.lecturer._id ? attendance.lecturer._id.toString() : (attendance.lecturer && attendance.lecturer.toString ? attendance.lecturer.toString() : String(attendance.lecturer));
      console.log('getSessionAttendance: attendanceLecturerId=', attendanceLecturerId, 'req.user.id=', req.user.id, 'req.user.role=', req.user.role);

      if (attendanceLecturerId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this attendance session'
        });
      }

      res.json({
        success: true,
        data: attendance
      });
    } catch (error) {
      console.error('Get session attendance error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch attendance records',
        error: error.message
      });
    }
  },

  // Get student's attendance records
  getStudentAttendance: async (req, res) => {
    try {
      const { subjectId, startDate, endDate } = req.query;

      const query = { 'records.student': req.user.id };

      if (subjectId) query.subject = subjectId;
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }

      const attendanceRecords = await Attendance.find(query)
        .populate('subject', 'name code')
        .populate('group', 'name')
        .populate('lecturer', 'name')
        .select('date subject group lecturer records.$ classType')
        .sort({ date: -1 });

      res.json({
        success: true,
        data: attendanceRecords
      });
    } catch (error) {
      console.error('Get student attendance error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch attendance records',
        error: error.message
      });
    }
  },

  // Generate attendance report
  generateReport: async (req, res) => {
    try {
      const { subjectId, groupId, startDate, endDate } = req.query;

      const query = {};
      if (subjectId) query.subject = subjectId;
      if (groupId) query.group = groupId;
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }

      const sessions = await Attendance.find(query)
        .populate('subject', 'name code')
        .populate('group', 'name students')
        .populate('records.student', 'name email studentId')
        .sort({ date: 1 });

      // Calculate attendance statistics
      const report = {
        totalSessions: sessions.length,
        sessions: sessions.map(session => ({
          date: session.date,
          subject: session.subject,
          group: session.group,
          classType: session.classType,
          totalStudents: session.group?.students?.length || 0,
          presentCount: session.records.filter(r => r.status === 'present').length,
          absentCount: (session.group?.students?.length || 0) - session.records.filter(r => r.status === 'present').length,
          records: session.records
        }))
      };

      // Calculate overall attendance percentage
      const totalPossible = report.sessions.reduce((sum, s) => sum + s.totalStudents, 0);
      const totalPresent = report.sessions.reduce((sum, s) => sum + s.presentCount, 0);
      report.overallAttendance = totalPossible > 0 ? (totalPresent / totalPossible) * 100 : 0;

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      console.error('Generate attendance report error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate attendance report',
        error: error.message
      });
    }
  },

  // Update attendance record (for manual marking or excuses)
  updateRecord: async (req, res) => {
    try {
      const { sessionId, studentId } = req.params;
      const { error, value } = attendanceSchemas.updateRecord.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      const attendance = await Attendance.findById(sessionId);
      if (!attendance) {
        return res.status(404).json({
          success: false,
          message: 'Attendance session not found'
        });
      }

      // Check if user is authorized
      if (attendance.lecturer.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update attendance records'
        });
      }

      const record = attendance.records.find(
        r => r.student.toString() === studentId
      );

      if (record) {
        // Update existing record
        Object.assign(record, value);
      } else {
        // Add new record
        attendance.records.push({
          student: studentId,
          ...value,
          markedAt: new Date(),
          markedBy: 'manual'
        });
      }

      await attendance.save();

      res.json({
        success: true,
        message: 'Attendance record updated successfully'
      });
    } catch (error) {
      console.error('Update attendance record error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update attendance record',
        error: error.message
      });
    }
  }
};
