const User = require('../models/User');
const Student = require('../models/Student');

module.exports = {
  getProfile: async (req, res) => {
    try {
      const userPayload = req.user;
      if (!userPayload) return res.status(401).json({ error: 'Unauthorized' });
      const user = await User.findById(userPayload.id).lean();
      const student = await Student.findOne({ userId: userPayload.id }).lean();
      return res.json({ user, student });
    } catch (err) {
      console.error('getProfile error', err);
      return res.status(500).json({ error: 'failed' });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const userPayload = req.user;
      if (!userPayload) return res.status(401).json({ error: 'Unauthorized' });
      const updates = {};
      const allowed = ['email', 'avatar', 'isPremium'];
      allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
      const user = await User.findByIdAndUpdate(userPayload.id, updates, { new: true }).lean();
      return res.json({ user });
    } catch (err) {
      console.error('updateProfile error', err);
      return res.status(500).json({ error: 'update failed' });
    }
  }
};
