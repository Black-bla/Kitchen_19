const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
const fs = require('fs');

jest.setTimeout(30000);

let app;
let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
  process.env.USE_STREAM_UPLOAD = 'false';

  // Connect DB
  const connectDB = require('../../../src/config/database');
  await connectDB();

  // Require app after envs and DB connect
  app = require('../../../src/app');

  // Mock external services to avoid dependencies
  const storage = require('../../../src/services/storage.service');
  jest.spyOn(storage, 'uploadFile').mockImplementation(async (file, folder) => {
    return { 
      secure_url: `https://cloudinary.com/${folder}/test-file.pdf`,
      public_id: 'test-public-id'
    };
  });

  const notification = require('../../../src/services/notification.service');
  jest.spyOn(notification, 'send').mockImplementation(async (data) => {
    return { success: true };
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

describe('Assignment Flow Integration', () => {
  let lecturerToken, studentToken, lecturerRes, studentRes;
  let assignmentId, subjectId, groupId;

  beforeAll(async () => {
    // Create lecturer user
    lecturerRes = await request(app)
      .post('/api/auth/oauth')
      .send({
        authProvider: 'google',
        authId: 'lecturer-integration-1',
        email: 'lecturer@example.com',
        role: 'lecturer'
      })
      .expect(200);

    lecturerToken = lecturerRes.body.token;

    // Create student user
    studentRes = await request(app)
      .post('/api/auth/oauth')
      .send({
        authProvider: 'google',
        authId: 'student-integration-1',
        email: 'student@example.com',
        role: 'student'
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

    // Create test subject (simplified - in real app this would be created via course/subject endpoints)
    const Subject = require('../../../src/models/Subject');
    const subject = await Subject.create({
      name: 'Integration Test Subject',
      code: 'INT101',
      course: course._id,
      createdBy: lecturerRes.body.user.id
    });
    subjectId = subject._id;

    // Create test group
    const Group = require('../../../src/models/Group');
    const group = await Group.create({
      name: 'Integration Test Group',
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

  test('lecturer creates assignment, student submits, lecturer grades', async () => {
    // Step 1: Lecturer creates assignment
    const createRes = await request(app)
      .post('/api/assignments')
      .set('Authorization', `Bearer ${lecturerToken}`)
      .field('title', 'Integration Test Assignment')
      .field('description', 'Test assignment for integration testing')
      .field('type', 'assignment')
      .field('subject', subjectId.toString())
      .field('group', groupId.toString())
      .field('dueDate', '2025-12-31T23:59:59Z')
      .field('totalMarks', 100)
      .attach('attachments', Buffer.from('Test attachment content'), 'test.pdf')
      .expect(201);

    expect(createRes.body.success).toBe(true);
    expect(createRes.body.data.title).toBe('Integration Test Assignment');
    expect(createRes.body.data.attachments).toHaveLength(1);
    expect(createRes.body.data.attachments[0]).toContain('assignments');

    assignmentId = createRes.body.data._id;

    // Step 2: Student views assignments
    const viewRes = await request(app)
      .get('/api/assignments/')
      .query({ groupId: groupId })
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(200);

    expect(viewRes.body.success).toBe(true);
    expect(viewRes.body.data).toHaveLength(1);
    expect(viewRes.body.data[0].title).toBe('Integration Test Assignment');

    // Step 3: Student submits assignment
    const submitRes = await request(app)
      .post(`/api/assignments/${assignmentId}/submit`)
      .set('Authorization', `Bearer ${studentToken}`)
      .field('notes', 'My submission notes')
      .attach('submission', Buffer.from('Submission content'), 'submission.pdf')
      .expect(200);

    expect(submitRes.body.success).toBe(true);
    expect(submitRes.body.message).toBe('Assignment submitted successfully');

    // Step 4: Lecturer views submissions
    const submissionsRes = await request(app)
      .get(`/api/assignments/${assignmentId}/submissions`)
      .set('Authorization', `Bearer ${lecturerToken}`)
      .expect(200);

    expect(submissionsRes.body.success).toBe(true);
    expect(submissionsRes.body.data.submissions).toHaveLength(1);
    expect(submissionsRes.body.data.submissions[0].student).toBeDefined();

    // Step 5: Lecturer grades submission
    const gradeRes = await request(app)
      .post(`/api/assignments/${assignmentId}/grade/${submissionsRes.body.data.submissions[0].student}`)
      .set('Authorization', `Bearer ${lecturerToken}`)
      .send({
        marks: 85,
        feedback: 'Good work! Well done.'
      })
      .expect(200);

    expect(gradeRes.body.success).toBe(true);
    expect(gradeRes.body.message).toBe('Submission graded successfully');

    // Step 6: Student views their graded submission
    const mySubmissionsRes = await request(app)
      .get('/api/assignments/my-submissions')
      .query({ subjectId: subjectId })
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(200);

    expect(mySubmissionsRes.body.success).toBe(true);
    expect(mySubmissionsRes.body.data).toHaveLength(1);
    expect(mySubmissionsRes.body.data[0].submissions[0].marks).toBe(85);
    expect(mySubmissionsRes.body.data[0].submissions[0].feedback).toBe('Good work! Well done.');
  });

  test('assignment validation and error handling', async () => {
    // Test missing required fields
    const invalidRes = await request(app)
      .post('/api/assignments')
      .set('Authorization', `Bearer ${lecturerToken}`)
      .send({
        description: 'Missing title and other required fields'
      })
      .expect(400);

    expect(invalidRes.body.success).toBe(false);
    expect(invalidRes.body.error).toBe('Validation failed');

    // Test late submission
    const Assignment = require('../../../src/models/Assignment');
    const pastAssignment = await Assignment.create({
      title: 'Past Due Assignment',
      type: 'assignment',
      subject: subjectId,
      group: groupId,
      dueDate: new Date('2020-01-01'), // Past date
      createdBy: lecturerRes.body.user.id
    });

    const lateSubmitRes = await request(app)
      .post(`/api/assignments/${pastAssignment._id}/submit`)
      .set('Authorization', `Bearer ${studentToken}`)
      .attach('submission', Buffer.from('Late submission'), 'late.pdf')
      .expect(400);

    expect(lateSubmitRes.body.success).toBe(false);
    expect(lateSubmitRes.body.message).toBe('Assignment submission deadline has passed');
  });

  test('assignment permissions and authorization', async () => {
    // Create assignment
    const assignmentRes = await request(app)
      .post('/api/assignments')
      .set('Authorization', `Bearer ${lecturerToken}`)
      .field('title', 'Permission Test Assignment')
      .field('type', 'assignment')
      .field('subject', subjectId.toString())
      .field('group', groupId.toString())
      .field('dueDate', '2025-12-31T23:59:59Z')
      .expect(201);

    const testAssignmentId = assignmentRes.body.data._id;

    // Try to grade as student (should fail)
    const unauthorizedGradeRes = await request(app)
      .post(`/api/assignments/${testAssignmentId}/grade/student123`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ marks: 50 })
      .expect(403);

    expect(unauthorizedGradeRes.body.success).toBe(false);
    expect(unauthorizedGradeRes.body.message).toContain('Not authorized');

    // Try to view submissions as student (should fail)
    const unauthorizedViewRes = await request(app)
      .get(`/api/assignments/${testAssignmentId}/submissions`)
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(403);

    expect(unauthorizedViewRes.body.success).toBe(false);
    expect(unauthorizedViewRes.body.message).toContain('Not authorized');
  });

  test('assignment file handling', async () => {
    // Create assignment with multiple attachments
    const multiFileRes = await request(app)
      .post('/api/assignments')
      .set('Authorization', `Bearer ${lecturerToken}`)
      .field('title', 'Multi-File Assignment')
      .field('type', 'assignment')
      .field('subject', subjectId.toString())
      .field('group', groupId.toString())
      .field('dueDate', '2025-12-31T23:59:59Z')
      .attach('attachments', Buffer.from('File 1 content'), 'file1.pdf')
      .attach('attachments', Buffer.from('File 2 content'), 'file2.docx')
      .expect(201);

    expect(multiFileRes.body.success).toBe(true);
    expect(multiFileRes.body.data.attachments).toHaveLength(2);

    // Update assignment with new files
    const updateRes = await request(app)
      .put(`/api/assignments/${multiFileRes.body.data._id}`)
      .set('Authorization', `Bearer ${lecturerToken}`)
      .field('title', 'Updated Multi-File Assignment')
      .attach('attachments', Buffer.from('New file content'), 'newfile.pdf')
      .expect(200);

    expect(updateRes.body.success).toBe(true);
    expect(updateRes.body.data.title).toBe('Updated Multi-File Assignment');
  });
});