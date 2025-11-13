const Institution = require('../models/Institution');
const { validate } = require('../middleware/validation.middleware');
const { institutionSchemas } = require('../utils/validators');

module.exports = {
  create: [
    validate(institutionSchemas.create),
    async (req, res) => {
      try {
        const user = req.user;
        if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

        const inst = await Institution.create(req.body);
        return res.status(201).json({ success: true, institution: inst });
      } catch (err) {
        console.error('institution.create error', err);
        return res.status(500).json({ success: false, error: 'Institution creation failed' });
      }
    }
  ],

  list: async (req, res) => {
    try {
      const { approved, country, limit = 50 } = req.query;
      const query = {};

      if (approved !== undefined) query.approved = approved === 'true';
      if (country) query.country = new RegExp(country, 'i');

      const institutions = await Institution.find(query)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 })
        .lean();

      return res.json({ success: true, institutions });
    } catch (err) {
      console.error('institution.list error', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve institutions' });
    }
  },

  get: async (req, res) => {
    try {
      const { id } = req.params;
      const institution = await Institution.findById(id).lean();

      if (!institution) {
        return res.status(404).json({ success: false, error: 'Institution not found' });
      }

      return res.json({ success: true, institution });
    } catch (err) {
      console.error('institution.get error', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve institution' });
    }
  },

  update: [
    validate(institutionSchemas.create), // Reuse create schema for updates
    async (req, res) => {
      try {
        const user = req.user;
        if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

        const { id } = req.params;
        const institution = await Institution.findByIdAndUpdate(id, req.body, { new: true });

        if (!institution) {
          return res.status(404).json({ success: false, error: 'Institution not found' });
        }

        return res.json({ success: true, institution });
      } catch (err) {
        console.error('institution.update error', err);
        return res.status(500).json({ success: false, error: 'Institution update failed' });
      }
    }
  ]
};
