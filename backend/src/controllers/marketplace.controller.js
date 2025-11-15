  createItem: (req, res) => res.json({}),
  list: (req, res) => res.json([])
};


const Marketplace = require('../models/Marketplace');
const { validate } = require('../middleware/validation.middleware');
const { marketplaceSchemas } = require('../utils/validators');

module.exports = {
  // Create a new marketplace item
  createItem: [
    validate(marketplaceSchemas.createItem),
    async (req, res) => {
      try {
        const user = req.user;
        if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });
        const item = await Marketplace.create({ ...req.body, seller: user.id });
        return res.status(201).json({ success: true, item });
      } catch (err) {
        console.error('marketplace.createItem error', err);
        return res.status(500).json({ success: false, error: 'Failed to create item' });
      }
    }
  ],

  // List marketplace items
  list: async (req, res) => {
    try {
      const { category, limit = 50 } = req.query;
      const query = {};
      if (category) query.category = category;
      const items = await Marketplace.find(query).limit(parseInt(limit)).sort({ createdAt: -1 }).lean();
      return res.json({ success: true, items });
    } catch (err) {
      console.error('marketplace.list error', err);
      return res.status(500).json({ success: false, error: 'Failed to list items' });
    }
  }
};
