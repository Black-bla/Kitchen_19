const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

jest.setTimeout(30000);

let app;
let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

  // Connect DB
  const connectDB = require('../../../src/config/database');
  await connectDB();

  // Require app after envs and DB connect
  app = require('../../../src/app');

  // Mock external services
  const notification = require('../../../src/services/notification.service');
  jest.spyOn(notification, 'send').mockImplementation(async (data) => {
    return { success: true };
  });

  const geolocation = require('../../../src/services/geolocation.service');
  jest.spyOn(geolocation, 'isWithinRadius').mockImplementation((point, center, radius) => {
    // Mock location validation - allow all for testing
    return true;
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

describe('Attendance Flow Integration', () => {
  let lecturerToken, studentToken;
  let attendanceId, subjectId, groupId;

  beforeAll(async () => {
    // Create lecturer user
    lecturerRes = await request(app)
      .post('/api/auth/oauth')
      .send({
        authProvider: 'google',
        authId: 'attendance-lecturer-1',
        email: 'attendance-lecturer@example.com'
      })
      .expect(200);

    lecturerToken = lecturerRes.body.token;

    // Create student user
    studentRes = await request(app)
      .post('/api/auth/oauth')
      .send({
        authProvider: 'google',
        authId: 'attendance-student-1',
        email: 'attendance-student@example.com'
      })
      .expect(200);

    studentToken = studentRes.body.token;

    // Create test institution
    const Institution = require('../../../src/models/Institution');
    const institution = await Institution.create({
      name: 'Test University',
      code: 'TU',
      country: 'Test Country'
    });

    // Create test course
    const Course = require('../../../src/models/Course');
    const course = await Course.create({
      name: 'Computer Science',
      code: 'CS101',
      institution: institution._id,
      duration: 4
    });

    // Create test subject
    const Subject = require('../../../src/models/Subject');
    const subject = await Subject.create({
      name: 'Attendance Test Subject',
      code: 'ATT101',
      course: course._id,
      createdBy: lecturerRes.body.user.id
    });
    subjectId = subject._id;

    // Create test group
    const Group = require('../../../src/models/Group');
    const group = await Group.create({
      name: 'Attendance Test Group',
      type: 'course',
      institution: institution._id,
      course: course._id,
      members: [
        { user: lecturerRes.body.user.id, role: 'lecturer' },
        { user: studentRes.body.user.id, role: 'student' }
      ],
      createdBy: lecturerRes.body.user.id
    });
    groupId = group._id;
  });

  test('lecturer creates session, student marks attendance', async () => {
    // Step 1: Lecturer creates attendance session
    const sessionRes = await request(app)
      .post('/api/attendance/session')
      .set('Authorization', `Bearer ${lecturerToken}`)
      .send({
        subject: subjectId.toString(),
        group: groupId.toString(),
        lecturer: lecturerRes.body.user.id,
        date: new Date(),
        classType: 'physical',
        location: {
          latitude: -1.2864,
          longitude: 36.8172,
          radius: 100
        }
      });

    console.log('Session creation response status:', sessionRes.status);
    console.log('Session creation response body:', JSON.stringify(sessionRes.body, null, 2));

    if (sessionRes.status !== 201) {
      console.log('Validation error details:', sessionRes.body.error);
      console.log('Full response:', sessionRes.body);
    }

    expect(sessionRes.status).toBe(201);
    expect(sessionRes.body.success).toBe(true);
    expect(sessionRes.body.data.classType).toBe('physical');
    expect(sessionRes.body.data.location).toBeDefined();

    attendanceId = sessionRes.body.data._id;

    // Step 2: Lecturer generates QR code
    const qrRes = await request(app)
      .post(`/api/attendance/${attendanceId}/generate-qr`)
      .set('Authorization', `Bearer ${lecturerToken}`)
      .expect(200);

    expect(qrRes.body.success).toBe(true);
    expect(qrRes.body.data.qrCode).toBeDefined();
    expect(qrRes.body.data.expiry).toBeDefined();
    expect(qrRes.body.data.attendanceId).toBe(attendanceId);

    // Step 3: Student marks attendance using QR
    const markRes = await request(app)
      .post('/api/attendance/mark')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        attendanceId: attendanceId,
        lat: -1.2864,
        lon: 36.8172
      })
      .expect(200);

    expect(markRes.body.success).toBe(true);
    expect(markRes.body.message).toBe('Attendance marked successfully');

    // Step 4: Lecturer views attendance records
    const viewRes = await request(app)
      .get(`/api/attendance/session/${attendanceId}`)
      .set('Authorization', `Bearer ${lecturerToken}`)
      .expect(200);

    expect(viewRes.body.success).toBe(true);
    expect(viewRes.body.data.records).toHaveLength(1);
    expect(viewRes.body.data.records[0].student).toBeDefined();
    expect(viewRes.body.data.records[0].status).toBe('present');
    expect(viewRes.body.data.records[0].markedBy).toBe('qr');

    // Step 5: Student views their attendance
    const studentViewRes = await request(app)
      .get('/api/attendance/student')
      .query({ subjectId: subjectId })
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(200);

    expect(studentViewRes.body.success).toBe(true);
    expect(studentViewRes.body.data).toHaveLength(1);
    expect(studentViewRes.body.data[0].records[0].status).toBe('present');
  });

  test('attendance validation and error handling', async () => {
    // Test duplicate session creation
    const today = new Date().toISOString().split('T')[0];

    // Create first session
    await request(app)
      .post('/api/attendance/session')
      .set('Authorization', `Bearer ${lecturerToken}`)
      .send({
        subject: subjectId.toString(),
        group: groupId.toString(),
        lecturer: lecturerRes.body.user.id,
        date: new Date(),
        classType: 'online'
      })
      .expect(201);

    // Try to create duplicate session
    const duplicateRes = await request(app)
      .post('/api/attendance/session')
      .set('Authorization', `Bearer ${lecturerToken}`)
      .send({
        subject: subjectId,
        group: groupId,
        date: today,
        classType: 'online'
      })
      .expect(400);

    expect(duplicateRes.body.success).toBe(false);
    expect(duplicateRes.body.message).toBe('Attendance session already exists for this date');

    // Test invalid session creation (missing required fields)
    const invalidRes = await request(app)
      .post('/api/attendance/session')
      .set('Authorization', `Bearer ${lecturerToken}`)
      .send({
        // Missing required fields
        date: today
      })
      .expect(400);

    expect(invalidRes.body.success).toBe(false);
    expect(invalidRes.body.message).toBe('Validation error');
  });

  test('attendance permissions and authorization', async () => {
    // Create session
    const sessionRes = await request(app)
      .post('/api/attendance/session')
      .set('Authorization', `Bearer ${lecturerToken}`)
      .send({
        subject: subjectId.toString(),
        group: groupId.toString(),
        lecturer: lecturerRes.body.user.id,
        date: new Date(),
        classType: 'online'
      })
      .expect(201);

    const testSessionId = sessionRes.body.data._id;

    // Try to generate QR as student (should fail)
    const unauthorizedQrRes = await request(app)
      .post(`/api/attendance/${testSessionId}/generate-qr`)
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(403);

    expect(unauthorizedQrRes.body.success).toBe(false);
    expect(unauthorizedQrRes.body.message).toContain('Not authorized');

    // Try to view session as different lecturer (should fail)
    const differentLecturerRes = await request(app)
      .post('/api/auth/oauth')
      .send({
        authProvider: 'google',
        authId: 'different-lecturer',
        email: 'different-lecturer@example.com'
      })
      .expect(200);

    const differentLecturerToken = differentLecturerRes.body.token;

    const viewFailRes = await request(app)
      .get(`/api/attendance/session/${testSessionId}`)
      .set('Authorization', `Bearer ${differentLecturerToken}`)
      .expect(403);

    expect(viewFailRes.body.success).toBe(false);
    expect(viewFailRes.body.message).toContain('Not authorized');
  });

  test('location-based attendance validation', async () => {
    // Create physical class session
    const physicalRes = await request(app)
      .post('/api/attendance/session')
      .set('Authorization', `Bearer ${lecturerToken}`)
      .send({
        subject: subjectId.toString(),
        group: groupId.toString(),
        lecturer: lecturerRes.body.user.id,
        date: new Date(),
        classType: 'physical',
        location: {
          latitude: -1.2864,
          longitude: 36.8172,
          radius: 50 // Small radius
        }
      })
      .expect(201);

    const physicalSessionId = physicalRes.body.data._id;

    // Generate QR
    await request(app)
      .post(`/api/attendance/${physicalSessionId}/generate-qr`)
      .set('Authorization', `Bearer ${lecturerToken}`)
      .expect(200);

    // Mock location service to return false (outside radius)
    const geolocation = require('../../../src/services/geolocation.service');
    geolocation.isWithinRadius.mockReturnValueOnce(false);

    // Try to mark attendance from outside location
    const locationFailRes = await request(app)
      .post('/api/attendance/mark')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        attendanceId: physicalSessionId,
        lat: 0, // Far from class location
        lon: 0
      })
      .expect(400);

    expect(locationFailRes.body.success).toBe(false);
    expect(locationFailRes.body.message).toContain('not within the required location');

    // Reset mock for online class
    geolocation.isWithinRadius.mockReturnValue(true);

    // Create online class session (no location validation)
    const onlineRes = await request(app)
      .post('/api/attendance/session')
      .set('Authorization', `Bearer ${lecturerToken}`)
      .send({
        subject: subjectId,
        group: groupId,
        date: '2025-12-03',
        classType: 'online'
        // No location for online class
      })
      .expect(201);

    const onlineSessionId = onlineRes.body.data._id;

    // Generate QR for online class
    await request(app)
      .post(`/api/attendance/${onlineSessionId}/generate-qr`)
      .set('Authorization', `Bearer ${lecturerToken}`)
      .expect(200);

    // Mark attendance for online class (should work without location)
    const onlineMarkRes = await request(app)
      .post('/api/attendance/mark')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        attendanceId: onlineSessionId
        // No location data needed for online
      })
      .expect(200);

    expect(onlineMarkRes.body.success).toBe(true);
  });

  test('attendance reporting and analytics', async () => {
    // Create multiple sessions with different attendance
    const session1Res = await request(app)
      .post('/api/attendance/session')
      .set('Authorization', `Bearer ${lecturerToken}`)
      .send({
        subject: subjectId,
        group: groupId,
        date: '2025-11-01',
        classType: 'online'
      })
      .expect(201);

    const session2Res = await request(app)
      .post('/api/attendance/session')
      .set('Authorization', `Bearer ${lecturerToken}`)
      .send({
        subject: subjectId.toString(),
        group: groupId.toString(),
        lecturer: lecturerRes.body.user.id,
        date: new Date(),
        classType: 'online'
      })
      .expect(201);

    // Generate QRs
    await request(app)
      .post(`/api/attendance/${session1Res.body.data._id}/generate-qr`)
      .set('Authorization', `Bearer ${lecturerToken}`);

    await request(app)
      .post(`/api/attendance/${session2Res.body.data._id}/generate-qr`)
      .set('Authorization', `Bearer ${lecturerToken}`);

    // Mark attendance for session 1
    await request(app)
      .post('/api/attendance/mark')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ attendanceId: session1Res.body.data._id });

    // Skip session 2 (student absent)

    // Generate report
    const reportRes = await request(app)
      .get('/api/attendance/report')
      .query({
        subjectId: subjectId,
        startDate: '2025-11-01',
        endDate: '2025-11-02'
      })
      .set('Authorization', `Bearer ${lecturerToken}`)
      .expect(200);

    expect(reportRes.body.success).toBe(true);
    expect(reportRes.body.data.totalSessions).toBe(2);
    expect(reportRes.body.data.sessions).toHaveLength(2);
    expect(reportRes.body.data.overallAttendance).toBe(50); // 1 present out of 2 sessions
  });

  test('manual attendance marking', async () => {
    // Create session
    const sessionRes = await request(app)
      .post('/api/attendance/session')
      .set('Authorization', `Bearer ${lecturerToken}`)
      .send({
        subject: subjectId.toString(),
        group: groupId.toString(),
        lecturer: lecturerRes.body.user.id,
        date: new Date(),
        classType: 'online'
      })
      .expect(201);

    const sessionId = sessionRes.body.data._id;

    // Lecturer manually marks attendance
    const manualMarkRes = await request(app)
      .put(`/api/attendance/session/${sessionId}/student/${'student123'}`) // Mock student ID
      .set('Authorization', `Bearer ${lecturerToken}`)
      .send({
        status: 'present',
        excuseReason: 'Late arrival'
      })
      .expect(200);

    expect(manualMarkRes.body.success).toBe(true);
    expect(manualMarkRes.body.message).toBe('Attendance record updated successfully');

    // Verify manual marking
    const viewRes = await request(app)
      .get(`/api/attendance/session/${sessionId}`)
      .set('Authorization', `Bearer ${lecturerToken}`)
      .expect(200);

    const manualRecord = viewRes.body.data.records.find(r => r.markedBy === 'manual');
    expect(manualRecord).toBeDefined();
    expect(manualRecord.status).toBe('present');
    expect(manualRecord.excuseReason).toBe('Late arrival');
  });
});