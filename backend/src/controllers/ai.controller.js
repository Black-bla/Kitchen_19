
const ocr = require('../services/ocr.service');
const aiService = require('../services/ai.service');
const Student = require('../models/Student');
const { validate } = require('../middleware/validation.middleware');
const { aiSchemas } = require('../utils/validators');

module.exports = {
  // AI chat endpoint using ai.service
  chat: [
    validate(aiSchemas.chat),
    async (req, res) => {
      try {
        const { prompt, context } = req.body;
        if (!prompt) return res.status(400).json({ error: 'Missing prompt' });
        const user = req.user;
        const reply = await aiService.chat({ prompt, context, user });
        return res.json({ reply });
      } catch (err) {
        console.error('ai.chat error', err);
        return res.status(500).json({ error: 'AI chat failed' });
      }
    }
  ],

  processAdmission: async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      // Accept file info or URL in body
      const source = req.body.fileUrl || req.body.filePath || (req.file && (req.file.url || req.file.path));
      if (!source) return res.status(400).json({ error: 'No file provided' });

      const parsed = await ocr.parseAdmissionLetter(source);

      // Optionally create or update student record
      let student = await Student.findOne({ userId: user.id });
      const data = {
        userId: user.id,
        admissionLetter: source,
        studentId: parsed.studentId || undefined,
        firstName: parsed.firstName || undefined,
        lastName: parsed.lastName || undefined,
        phoneNumber: parsed.phoneNumber || undefined,
        yearOfStudy: parsed.yearOfStudy || undefined
      };
      if (student) {
        Object.assign(student, data);
        await student.save();
      } else {
        student = await Student.create(data);
      }

      return res.json({ parsed, student });
    } catch (err) {
      console.error('ai.processAdmission error', err);
      return res.status(500).json({ error: 'failed' });
    }
  }
};
