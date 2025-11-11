const ocr = require('../services/ocr.service');
const Student = require('../models/Student');

module.exports = {
  chat: (req, res) => res.json({ reply: 'ai chat placeholder' }),

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
