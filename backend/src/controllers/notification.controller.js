  create: (req, res) => res.json({}),
  myNotifications: (req, res) => res.json([])
};


const Notification = require('../models/Notification');
const { validate } = require('../middleware/validation.middleware');
const { notificationSchemas } = require('../utils/validators');

module.exports = {
  // Create a new notification
  create: [
    validate(notificationSchemas.create),
    async (req, res) => {
      try {
        const user = req.user;
        if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });
        const notification = await Notification.create({ ...req.body, sender: user.id });
        return res.status(201).json({ success: true, notification });
      } catch (err) {
        console.error('notification.create error', err);
        return res.status(500).json({ success: false, error: 'Failed to create notification' });
      }
    }
  ],

  // Get notifications for the current user
  myNotifications: async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const notifications = await Notification.find({ recipients: user.id }).sort({ createdAt: -1 }).limit(50).lean();
      return res.json({ success: true, notifications });
    } catch (err) {
      console.error('notification.myNotifications error', err);
      return res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
    }
  }
};
