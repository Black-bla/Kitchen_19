  pendingInstitutions: (req, res) => res.json([]),
  approveInstitution: (req, res) => res.json({})
};


const Institution = require('../models/Institution');
const { validate } = require('../middleware/validation.middleware');
const { adminSchemas } = require('../utils/validators');

module.exports = {
  // List all pending institutions (not yet approved)
  pendingInstitutions: async (req, res) => {
    try {
      const institutions = await Institution.find({ approved: false }).sort({ createdAt: -1 }).lean();
      return res.json({ success: true, institutions });
    } catch (err) {
      console.error('admin.pendingInstitutions error', err);
      return res.status(500).json({ success: false, error: 'Failed to fetch pending institutions' });
    }
  },

  // Approve an institution by ID
  approveInstitution: [
    validate(adminSchemas.approveInstitution, 'body'),
    async (req, res) => {
      try {
        const { id } = req.body;
        const institution = await Institution.findByIdAndUpdate(
          id,
          { approved: true },
          { new: true }
        ).lean();
        if (!institution) {
          return res.status(404).json({ success: false, error: 'Institution not found' });
        }
        return res.json({ success: true, institution });
      } catch (err) {
        console.error('admin.approveInstitution error', err);
        return res.status(500).json({ success: false, error: 'Failed to approve institution' });
      }
    }
  ]
};
