const Institution = require('../models/Institution');
const Joi = require('joi');

const createSchema = Joi.object({ name: Joi.string().required(), code: Joi.string().allow('', null), website: Joi.string().uri().allow('', null), country: Joi.string().allow('', null) });

module.exports = {
  create: async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: 'Unauthorized' });
      const { error, value } = createSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.message });
      const inst = await Institution.create(value);
      return res.status(201).json({ institution: inst });
    } catch (err) {
      console.error('institution.create error', err);
      return res.status(500).json({ error: 'failed' });
    }
  },

  list: async (req, res) => {
    try {
      const q = {};
      if (req.query.approved) q.approved = req.query.approved === 'true';
      const items = await Institution.find(q).limit(50).lean();
      return res.json(items);
    } catch (err) {
      console.error('institution.list error', err);
      return res.status(500).json({ error: 'failed' });
    }
  }
};
