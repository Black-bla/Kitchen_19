const Course = require('../models/Course');
const Joi = require('joi');

const createSchema = Joi.object({ name: Joi.string().required(), institution: Joi.string().required(), code: Joi.string().allow('', null) });

module.exports = {
  create: async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: 'Unauthorized' });
      const { error, value } = createSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.message });
      const c = await Course.create(Object.assign({}, value, { createdBy: user.id }));
      return res.status(201).json({ course: c });
    } catch (err) {
      console.error('course.create error', err);
      return res.status(500).json({ error: 'failed' });
    }
  },

  list: async (req, res) => {
    try {
      const q = {};
      if (req.query.institution) q.institution = req.query.institution;
      const items = await Course.find(q).limit(100).lean();
      return res.json(items);
    } catch (err) {
      console.error('course.list error', err);
      return res.status(500).json({ error: 'failed' });
    }
  }
};
