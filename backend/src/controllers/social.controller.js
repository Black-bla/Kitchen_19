  createPost: (req, res) => res.json({}),
  feed: (req, res) => res.json([])
};


const Post = require('../models/Post');
const { validate } = require('../middleware/validation.middleware');
const { socialSchemas } = require('../utils/validators');

module.exports = {
  // Create a new post
  createPost: [
    validate(socialSchemas.createPost),
    async (req, res) => {
      try {
        const user = req.user;
        if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });
        const post = await Post.create({ ...req.body, author: user.id });
        return res.status(201).json({ success: true, post });
      } catch (err) {
        console.error('social.createPost error', err);
        return res.status(500).json({ success: false, error: 'Failed to create post' });
      }
    }
  ],

  // Get feed (recent posts)
  feed: async (req, res) => {
    try {
      const { limit = 50 } = req.query;
      const posts = await Post.find({})
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .populate('author', 'email avatar')
        .lean();
      return res.json({ success: true, posts });
    } catch (err) {
      console.error('social.feed error', err);
      return res.status(500).json({ success: false, error: 'Failed to fetch feed' });
    }
  }
};
