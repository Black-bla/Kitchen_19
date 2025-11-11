const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');

jest.setTimeout(20000);

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

  // Mock storage and ocr services to avoid external dependencies
  const storage = require('../../../src/services/storage.service');
  jest.spyOn(storage, 'uploadFile').mockImplementation(async (file, folder) => {
    return { url: 'https://res.cloudinary.com/demo/sample.pdf', public_id: 'demo/1', bytes: 1234, resource_type: 'image' };
  });

  const ocr = require('../../../src/services/ocr.service');
  jest.spyOn(ocr, 'parseAdmissionLetter').mockImplementation(async (src) => {
    return { firstName: 'Test', lastName: 'User', studentId: 'S123456', phoneNumber: '+1000000000', yearOfStudy: 2 };
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

test('upload admission creates/updates student (happy path)', async () => {
  // Create user via oauth
  const createRes = await request(app)
    .post('/api/auth/oauth')
    .send({ authProvider: 'google', authId: 'integration-1', email: 'int@example.com' })
    .expect(200);

  const token = createRes.body.token;
  expect(token).toBeTruthy();

  // Create a sample file
  const samplePath = path.join(__dirname, '../../tmp/sample.pdf');
  const fs = require('fs');
  fs.mkdirSync(path.dirname(samplePath), { recursive: true });
  fs.writeFileSync(samplePath, 'Integration test sample');

  const uploadRes = await request(app)
    .post('/api/auth/upload-admission')
    .set('Authorization', `Bearer ${token}`)
    .attach('file', samplePath)
    .expect(200);

  expect(uploadRes.body.student).toBeDefined();
  expect(uploadRes.body.parsed).toBeDefined();
  expect(uploadRes.body.parsed.firstName).toBe('Test');
});
