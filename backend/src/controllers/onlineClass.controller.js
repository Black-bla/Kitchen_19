  schedule: (req, res) => res.json({}),
  start: (req, res) => res.json({})
};


const OnlineClass = require('../models/OnlineClass');
const { validate } = require('../middleware/validation.middleware');
const { onlineClassSchemas } = require('../utils/validators');

module.exports = {
  // Schedule a new online class
  schedule: [
    validate(onlineClassSchemas.schedule),
    async (req, res) => {
      try {
        const user = req.user;
        if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });
        const onlineClass = await OnlineClass.create({ ...req.body, host: user.id });
        return res.status(201).json({ success: true, onlineClass });
      } catch (err) {
        console.error('onlineClass.schedule error', err);
        return res.status(500).json({ success: false, error: 'Failed to schedule online class' });
      }
    }
  ],

  // Start an online class (update status)
  start: [
    validate(onlineClassSchemas.start),
    async (req, res) => {
      try {
        const { id } = req.body;
        const onlineClass = await OnlineClass.findByIdAndUpdate(
          id,
          { status: 'live', startedAt: new Date() },
          { new: true }
        ).lean();
        if (!onlineClass) {
          return res.status(404).json({ success: false, error: 'Online class not found' });
        }
        return res.json({ success: true, onlineClass });
      } catch (err) {
        console.error('onlineClass.start error', err);
        return res.status(500).json({ success: false, error: 'Failed to start online class' });
      }
    }
  ]
};
