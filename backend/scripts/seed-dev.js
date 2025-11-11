require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../src/models/User');
const Student = require('../src/models/Student');
const connectDB = require('../src/config/database');

(async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/kitchen19';
    process.env.MONGO_URI = uri;
    await connectDB();
    console.log('Connected to DB', uri);

    // Create a test user
    const authProvider = 'test';
    const authId = process.env.SEED_AUTH_ID || 'dev-user-1';
    const email = process.env.SEED_EMAIL || 'dev@example.com';
    let user = await User.findOne({ authProvider, authId });
    if (!user) {
      user = await User.create({ authProvider, authId, email, role: 'student' });
      console.log('Created user:', user._id.toString());
    } else {
      console.log('User exists:', user._id.toString());
    }

    let student = await Student.findOne({ userId: user._id });
    if (!student) {
      student = await Student.create({ userId: user._id, firstName: 'Dev', lastName: 'User' });
      console.log('Created student:', student._id.toString());
    } else {
      console.log('Student exists:', student._id.toString());
    }

    const token = jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET || 'change-me', { expiresIn: '30d' });
    console.log('\nDev JWT token:\n', token, '\n');
    console.log('You can use this token with Authorization: Bearer <token> to test protected endpoints.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed', err);
    process.exit(1);
  }
})();
