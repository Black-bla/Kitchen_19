const Group = require('../models/Group');
const Joi = require('joi');

const createSchema = Joi.object({ name: Joi.string().required(), type: Joi.string().required(), institution: Joi.string().required() });

module.exports = {
  create: async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: 'Unauthorized' });
      const { error, value } = createSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.message });
      const g = await Group.create(Object.assign({}, value));
      return res.status(201).json({ group: g });
    } catch (err) {
      console.error('group.create error', err);
      return res.status(500).json({ error: 'failed' });
    }
  },

  myGroups: async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: 'Unauthorized' });
      const groups = await Group.find({ 'members.user': user.id }).limit(50).lean();
      return res.json(groups);
    } catch (err) {
      console.error('group.myGroups error', err);
      return res.status(500).json({ error: 'failed' });
    }
  }
};
