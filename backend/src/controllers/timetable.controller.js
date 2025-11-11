const Timetable = require('../models/Timetable');
const Joi = require('joi');

const createSchema = Joi.object({ group: Joi.string().required(), academicYear: Joi.number().required(), semester: Joi.number().required(), schedule: Joi.array().items(Joi.object()).required() });

module.exports = {
  create: async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: 'Unauthorized' });
      const { error, value } = createSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.message });
      const t = await Timetable.create(Object.assign({}, value, { createdBy: user.id }));
      return res.status(201).json({ timetable: t });
    } catch (err) {
      console.error('timetable.create error', err);
      return res.status(500).json({ error: 'failed' });
    }
  },

  getByGroup: async (req, res) => {
    try {
      const groupId = req.params.groupId;
      if (!groupId) return res.status(400).json({ error: 'missing groupId' });
      const items = await Timetable.find({ group: groupId }).limit(50).lean();
      return res.json(items);
    } catch (err) {
      console.error('timetable.getByGroup error', err);
      return res.status(500).json({ error: 'failed' });
    }
  }
};
