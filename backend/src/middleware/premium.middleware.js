const User = require('../models/User');

module.exports = async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Check if user has premium status and it's not expired
  const userDoc = await User.findById(user.id);
  if (!userDoc) {
    return res.status(404).json({ error: 'User not found' });
  }

  const isPremium = userDoc.isPremium && (!userDoc.premiumExpiresAt || userDoc.premiumExpiresAt > new Date());

  if (!isPremium) {
    return res.status(403).json({ error: 'Premium subscription required' });
  }

  next();
};
