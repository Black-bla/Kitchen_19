const Attendance = require('../../models/Attendance');
const attendanceController = require('../../controllers/attendance.controller');
const { attendanceSchemas } = require('../../utils/validators');
const { send } = require('../../services/notification.service');
const { isWithinRadius } = require('../../services/geolocation.service');
const QRCode = require('qrcode');

// Mock dependencies
jest.mock('../../models/Attendance');
jest.mock('../../utils/validators');
jest.mock('../../services/notification.service');
jest.mock('../../services/geolocation.service');
jest.mock('qrcode');

describe('Attendance Controller', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      user: {
        id: 'lecturer123',
        role: 'lecturer',
        subjects: ['subject123'],
        groups: ['group123']
      },
      body: {},
      query: {},
      params: {}
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };

    mockNext = jest.fn();

    // Setup mocks
    send.mockResolvedValue({ success: true });
    isWithinRadius.mockReturnValue(true);
    QRCode.toDataURL.mockResolvedValue('mock-qr-code-data');

    // Mock mongoose query methods
    const mockQuery = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([])
    };

    Attendance.find = jest.fn().mockReturnValue(mockQuery);
    Attendance.findById = jest.fn().mockReturnValue(mockQuery);
    Attendance.findOne = jest.fn().mockReturnValue(mockQuery);
    Attendance.findByIdAndUpdate = jest.fn().mockReturnValue(mockQuery);
    Attendance.findByIdAndDelete = jest.fn().mockReturnValue(mockQuery);
    Attendance.create = jest.fn();
    Attendance.countDocuments = jest.fn().mockResolvedValue(0);
  });

  describe('createSession()', () => {
    test('should create attendance session successfully', async () => {
      const sessionData = {
        subject: 'subject123',
        group: 'group123',
        date: '2025-11-13',
        classType: 'physical',
        location: { lat: -1.2864, lng: 36.8172, radius: 100 }
      };

      const mockAttendance = {
        ...sessionData,
        _id: 'session123',
        lecturer: 'lecturer123',
        save: jest.fn().mockResolvedValue(this)
      };

      attendanceSchemas.createSession.validate.mockReturnValue({ error: null, value: sessionData });
      Attendance.findOne.mockResolvedValue(null);
      Attendance.mockImplementation(() => mockAttendance);
      send.mockResolvedValue();

      mockReq.body = sessionData;

      await attendanceController.createSession(mockReq, mockRes);

      expect(attendanceSchemas.createSession.validate).toHaveBeenCalledWith(sessionData);
      expect(Attendance.findOne).toHaveBeenCalled();
      expect(Attendance).toHaveBeenCalledWith({
        ...sessionData,
        lecturer: 'lecturer123'
      });
      expect(send).toHaveBeenCalledWith({
        title: 'New Attendance Session',
        body: 'Physical class attendance is now open',
        type: 'attendance',
        recipients: 'group123',
        data: { attendanceId: 'session123' }
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    test('should validate lecturer permissions', async () => {
      const sessionData = {
        subject: 'differentSubject',
        group: 'differentGroup',
        date: '2025-11-13',
        classType: 'online'
      };

      attendanceSchemas.createSession.validate.mockReturnValue({ error: null, value: sessionData });

      mockReq.user.subjects = ['subject123']; // Different subject
      mockReq.user.groups = ['group123']; // Different group
      mockReq.body = sessionData;

      await attendanceController.createSession(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not authorized to create attendance for this subject/group'
      });
    });

    test('should prevent duplicate sessions', async () => {
      const sessionData = {
        subject: 'subject123',
        group: 'group123',
        date: '2025-11-13',
        classType: 'online'
      };

      const existingSession = { _id: 'existing123' };

      attendanceSchemas.createSession.validate.mockReturnValue({ error: null, value: sessionData });
      Attendance.findOne.mockResolvedValue(existingSession);

      mockReq.body = sessionData;

      await attendanceController.createSession(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Attendance session already exists for this date'
      });
    });

    test('should handle validation errors', async () => {
      const validationError = {
        details: [{ message: 'Subject is required' }]
      };

      attendanceSchemas.createSession.validate.mockReturnValue({
        error: validationError,
        value: null
      });

      await attendanceController.createSession(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation error',
        error: 'Subject is required'
      });
    });
  });

  describe('generateQr()', () => {
    test('should generate QR code successfully', async () => {
      const mockAttendance = {
        _id: 'session123',
        lecturer: 'lecturer123',
        qrCode: null,
        qrExpiry: null,
        save: jest.fn().mockResolvedValue(this)
      };

      const qrData = {
        attendanceId: 'session123',
        timestamp: expect.any(Number),
        expiry: expect.any(Number)
      };

      Attendance.findById.mockResolvedValue(mockAttendance);
      QRCode.toDataURL.mockResolvedValue('data:image/png;base64,qrCodeData');

      mockReq.params.id = 'session123';

      await attendanceController.generateQr(mockReq, mockRes);

      expect(Attendance.findById).toHaveBeenCalledWith('session123');
      expect(QRCode.toDataURL).toHaveBeenCalledWith(JSON.stringify({
        attendanceId: 'session123',
        timestamp: expect.any(Number),
        expiry: expect.any(Number)
      }));
      expect(mockAttendance.save).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          qrCode: 'data:image/png;base64,qrCodeData',
          expiry: qrData.expiry,
          attendanceId: 'session123'
        }
      });
    });

    test('should check authorization', async () => {
      const mockAttendance = {
        _id: 'session123',
        lecturer: 'differentLecturer'
      };

      Attendance.findById.mockResolvedValue(mockAttendance);

      mockReq.params.id = 'session123';
      mockReq.user.id = 'lecturer123'; // Different lecturer

      await attendanceController.generateQr(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not authorized to generate QR for this session'
      });
    });
  });

  describe('markAttendance()', () => {
    test('should mark attendance successfully', async () => {
      const markData = {
        attendanceId: 'session123',
        lat: -1.2864,
        lon: 36.8172
      };

      const mockAttendance = {
        _id: 'session123',
        classType: 'physical',
        location: { lat: -1.2864, lng: 36.8172, radius: 100 },
        qrExpiry: new Date(Date.now() + 10000), // Not expired
        records: [],
        save: jest.fn().mockResolvedValue(this)
      };

      attendanceSchemas.markAttendance.validate.mockReturnValue({ error: null, value: markData });
      Attendance.findById.mockResolvedValue(mockAttendance);
      isWithinRadius.mockReturnValue(true);

      mockReq.body = markData;
      mockReq.user.id = 'student123';

      await attendanceController.markAttendance(mockReq, mockRes);

      expect(isWithinRadius).toHaveBeenCalledWith(
        { lat: -1.2864, lon: 36.8172 },
        { lat: -1.2864, lng: 36.8172 },
        100 / 1000 // Convert meters to km
      );
      expect(mockAttendance.records).toHaveLength(1);
      expect(mockAttendance.records[0]).toMatchObject({
        student: 'student123',
        status: 'present',
        markedBy: 'qr',
        location: { lat: -1.2864, lon: 36.8172 }
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Attendance marked successfully'
      });
    });

    test('should validate location for physical classes', async () => {
      const markData = {
        attendanceId: 'session123',
        lat: 0,
        lon: 0
      };

      const mockAttendance = {
        _id: 'session123',
        classType: 'physical',
        location: { lat: -1.2864, lng: 36.8172, radius: 100 },
        qrExpiry: new Date(Date.now() + 10000),
        records: []
      };

      attendanceSchemas.markAttendance.validate.mockReturnValue({ error: null, value: markData });
      Attendance.findById.mockResolvedValue(mockAttendance);
      isWithinRadius.mockReturnValue(false); // Outside radius

      mockReq.body = markData;

      await attendanceController.markAttendance(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'You are not within the required location for this class'
      });
    });

    test('should skip location validation for online classes', async () => {
      const markData = {
        attendanceId: 'session123'
      };

      const mockAttendance = {
        _id: 'session123',
        classType: 'online', // No location required
        qrExpiry: new Date(Date.now() + 10000),
        records: [],
        save: jest.fn().mockResolvedValue(this)
      };

      attendanceSchemas.markAttendance.validate.mockReturnValue({ error: null, value: markData });
      Attendance.findById.mockResolvedValue(mockAttendance);

      mockReq.body = markData;
      mockReq.user.id = 'student123';

      await attendanceController.markAttendance(mockReq, mockRes);

      expect(isWithinRadius).not.toHaveBeenCalled();
      expect(mockAttendance.records).toHaveLength(1);
    });

    test('should prevent expired QR codes', async () => {
      const markData = { attendanceId: 'session123' };

      const mockAttendance = {
        _id: 'session123',
        qrExpiry: new Date(Date.now() - 10000) // Expired
      };

      attendanceSchemas.markAttendance.validate.mockReturnValue({ error: null, value: markData });
      Attendance.findById.mockResolvedValue(mockAttendance);

      mockReq.body = markData;

      await attendanceController.markAttendance(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'QR code has expired'
      });
    });

    test('should prevent duplicate attendance', async () => {
      const markData = { attendanceId: 'session123' };

      const mockAttendance = {
        _id: 'session123',
        qrExpiry: new Date(Date.now() + 10000),
        records: [{ student: 'student123' }] // Already marked
      };

      attendanceSchemas.markAttendance.validate.mockReturnValue({ error: null, value: markData });
      Attendance.findById.mockResolvedValue(mockAttendance);

      mockReq.body = markData;
      mockReq.user.id = 'student123';

      await attendanceController.markAttendance(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Attendance already marked for this session'
      });
    });
  });

  describe('getSessionAttendance()', () => {
    test('should return session attendance for lecturer', async () => {
      const mockAttendance = {
        _id: 'session123',
        lecturer: 'lecturer123',
        subject: 'subject123',
        records: [{ student: 'student123' }]
      };

      Attendance.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis()
      });
      Attendance.findById().populate().populate().populate.mockResolvedValue(mockAttendance);

      mockReq.params.id = 'session123';

      await attendanceController.getSessionAttendance(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockAttendance
      });
    });

    test('should check lecturer authorization', async () => {
      const mockAttendance = {
        _id: 'session123',
        lecturer: 'differentLecturer'
      };

      Attendance.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis()
      });
      Attendance.findById().populate().populate().populate.mockResolvedValue(mockAttendance);

      mockReq.params.id = 'session123';
      mockReq.user.id = 'lecturer123'; // Different lecturer

      await attendanceController.getSessionAttendance(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not authorized to view this attendance session'
      });
    });
  });

  describe('getStudentAttendance()', () => {
    test('should return student attendance records', async () => {
      const mockRecords = [
        {
          date: new Date('2025-11-13'),
          subject: 'subject123',
          records: [{ student: 'student123' }]
        }
      ];

      Attendance.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis()
      });
      Attendance.find().populate().populate().populate().sort.mockResolvedValue(mockRecords);

      mockReq.query = { subjectId: 'subject123' };

      await attendanceController.getStudentAttendance(mockReq, mockRes);

      expect(Attendance.find).toHaveBeenCalledWith({
        'records.student': 'lecturer123',
        subject: 'subject123'
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockRecords
      });
    });

    test('should filter by date range', async () => {
      const mockRecords = [{ date: new Date('2025-11-13') }];

      Attendance.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis()
      });
      Attendance.find().populate().populate().populate().sort.mockResolvedValue(mockRecords);

      mockReq.query = {
        startDate: '2025-11-01',
        endDate: '2025-11-30'
      };

      await attendanceController.getStudentAttendance(mockReq, mockRes);

      expect(Attendance.find).toHaveBeenCalledWith({
        'records.student': 'lecturer123',
        date: {
          $gte: new Date('2025-11-01'),
          $lte: new Date('2025-11-30')
        }
      });
    });
  });

  describe('generateReport()', () => {
    test('should generate attendance report', async () => {
      const mockSessions = [
        {
          date: new Date('2025-11-13'),
          subject: 'subject123',
          group: { name: 'Group A', students: ['student1', 'student2', 'student3'] },
          records: [
            { student: 'student1', status: 'present' },
            { student: 'student2', status: 'present' }
            // student3 is absent
          ]
        }
      ];

      Attendance.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis()
      });
      Attendance.find().populate().populate().populate().sort.mockResolvedValue(mockSessions);

      mockReq.query = { subjectId: 'subject123' };

      await attendanceController.generateReport(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          totalSessions: 1,
          sessions: [
            {
              date: new Date('2025-11-13'),
              subject: 'subject123',
              group: { name: 'Group A', students: ['student1', 'student2', 'student3'] },
              totalStudents: 3,
              presentCount: 2,
              absentCount: 1,
              records: [
                { student: 'student1', status: 'present' },
                { student: 'student2', status: 'present' }
              ]
            }
          ],
          overallAttendance: (2 / 3) * 100 // 66.67%
        }
      });
    });
  });

  describe('updateRecord()', () => {
    test('should update attendance record', async () => {
      const updateData = { status: 'present', excuseReason: 'Late' };
      const mockAttendance = {
        _id: 'session123',
        lecturer: 'lecturer123',
        records: [{ student: 'student123', status: 'absent' }],
        save: jest.fn().mockResolvedValue(this)
      };

      attendanceSchemas.updateRecord.validate.mockReturnValue({ error: null, value: updateData });
      Attendance.findById.mockResolvedValue(mockAttendance);

      mockReq.params = { sessionId: 'session123', studentId: 'student123' };
      mockReq.body = updateData;

      await attendanceController.updateRecord(mockReq, mockRes);

      expect(mockAttendance.records[0]).toMatchObject({
        student: 'student123',
        status: 'present',
        excuseReason: 'Late'
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Attendance record updated successfully'
      });
    });

    test('should add new record if not exists', async () => {
      const updateData = { status: 'present' };
      const mockAttendance = {
        _id: 'session123',
        lecturer: 'lecturer123',
        records: [], // No existing records
        save: jest.fn().mockResolvedValue(this)
      };

      attendanceSchemas.updateRecord.validate.mockReturnValue({ error: null, value: updateData });
      Attendance.findById.mockResolvedValue(mockAttendance);

      mockReq.params = { sessionId: 'session123', studentId: 'student123' };
      mockReq.body = updateData;

      await attendanceController.updateRecord(mockReq, mockRes);

      expect(mockAttendance.records).toHaveLength(1);
      expect(mockAttendance.records[0]).toMatchObject({
        student: 'student123',
        status: 'present',
        markedBy: 'manual'
      });
    });
  });
});