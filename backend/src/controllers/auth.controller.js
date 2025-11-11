// auth.controller.js - OAuth and auth-related handlers (minimal implementation)
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const ocr = require('../services/ocr.service');

const signToken = (user) => {
  const payload = { id: user._id.toString(), role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET || 'change-me', { expiresIn: '30d' });
};

module.exports = {
  // Minimal OAuth-like endpoint: accepts provider/authId/email and returns JWT
  oauth: async (req, res) => {
    try {
      const { authProvider, authId, email, role = 'student' } = req.body;
      if (!authProvider || !authId || !email) return res.status(400).json({ error: 'Missing fields' });

      let user = await User.findOne({ authProvider, authId });
      if (!user) {
        user = await User.create({ authProvider, authId, email, role });
      }
      const token = signToken(user);
      return res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'oauth failed' });
    }
  },

  // Clerk login: server verifies Clerk session token server-side and exchanges for app JWT
  clerkLogin: async (req, res) => {
    try {
      // Accept either Authorization: Bearer <clerk-session-token> or { clerkToken }
      const authHeader = req.headers.authorization;
      const clerkToken = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : req.body && req.body.clerkToken;

      if (!clerkToken) {
        return res.status(400).json({ error: 'Missing clerk session token' });
      }

      // Attempt server-side verification using clerk.service if available
      let clerkPayload = null;
      try {
        const clerkService = require('../services/clerk.service');
        clerkPayload = await clerkService.verifySession(clerkToken);
      } catch (verr) {
        // If verification fails, log and return 401
        console.error('Clerk verification failed', verr.message || verr);
        return res.status(401).json({ error: 'Invalid Clerk session token' });
      }

      // Extract user info from clerkPayload. The exact shape depends on Clerk API.
      // Try common fields but fall back to body if provided.
      const clerkUser = clerkPayload?.user || clerkPayload?.data || {};
      const clerkId = clerkUser?.id || clerkUser?.user_id || req.body.clerkId;
      const email = clerkUser?.email || clerkUser?.primary_email_address || req.body.email;
      const firstName = clerkUser?.first_name || clerkUser?.firstName || req.body.firstName;
      const lastName = clerkUser?.last_name || clerkUser?.lastName || req.body.lastName;
      const role = req.body.role || 'student';

      if (!clerkId || !email) {
        return res.status(400).json({ error: 'Verified Clerk payload missing id or email' });
      }

      let user = await User.findOne({ authProvider: 'clerk', authId: clerkId });
      if (!user) {
        user = await User.create({ authProvider: 'clerk', authId: clerkId, email, role });
      } else if (!user.email && email) {
        user.email = email;
        await user.save();
      }

      // Sync student profile for student role
      if (role === 'student' && (firstName || lastName)) {
        const student = await Student.findOne({ userId: user._id });
        if (student) {
          if (firstName) student.firstName = firstName;
          if (lastName) student.lastName = lastName;
          await student.save();
        } else {
          await Student.create({ userId: user._id, firstName: firstName || '', lastName: lastName || '' });
        }
      }

      const token = signToken(user);
      return res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'clerk login failed' });
    }
  },

  // Upload admission letter, parse, and create/update Student record
  uploadAdmission: async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: 'Unauthorized' });
      const file = req.file;
      if (!file) return res.status(400).json({ error: 'No file uploaded' });

  // If the middleware streamed directly to Cloudinary it will provide a URL
  // in `file.url`. Prefer that (ocr.parseAdmissionLetter supports remote URLs).
  const sourceForOcr = file.url || file.path || file.buffer || file;
  const parsed = await ocr.parseAdmissionLetter(sourceForOcr);
      // parsed expected to include firstName,lastName,studentId,institution,course,yearOfStudy
      // Upload to Cloudinary (if configured) and remove temp file inside service
      const storageService = require('../services/storage.service');
      let uploaded = null;
      try {
        // Only attempt to upload to Cloudinary if we have a local file path or buffer
        if (!file.url) {
          uploaded = await storageService.uploadFile(file, 'admission-letters');
        }
      } catch (ue) {
        console.warn('Cloudinary upload failed, continuing with available path/url', ue.message || ue);
      }

      const data = {
        userId: user.id,
        // If the file was streamed directly to Cloudinary, use that URL. Otherwise use uploaded result or local path.
        admissionLetter: file.url || (uploaded && uploaded.url) || file.path || file.filename || '',
        studentId: parsed.studentId || '',
        firstName: parsed.firstName || '',
        lastName: parsed.lastName || '',
        phoneNumber: parsed.phoneNumber || '',
        institution: parsed.institutionId || null,
        faculty: parsed.faculty || '',
        school: parsed.school || '',
        department: parsed.department || '',
        yearOfStudy: parsed.yearOfStudy || 1
      };

      let student = await Student.findOne({ userId: user.id });
      if (student) {
        student = Object.assign(student, data);
        await student.save();
      } else {
        student = await Student.create(data);
      }

      return res.json({ student, parsed });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'upload failed' });
    }
  },

  // Return current authenticated user and student profile if available
  me: async (req, res) => {
    try {
      const userPayload = req.user;
      if (!userPayload) return res.status(401).json({ error: 'Unauthorized' });
      const user = await User.findById(userPayload.id).lean();
      const student = await Student.findOne({ userId: userPayload.id }).lean();
      return res.json({ user, student });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'failed' });
    }
  }
};
