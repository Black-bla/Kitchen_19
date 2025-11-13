const Group = require('../models/Group');
const { validate } = require('../middleware/validation.middleware');
const { groupSchemas } = require('../utils/validators');

module.exports = {
  create: [
    validate(groupSchemas.create),
    async (req, res) => {
      try {
        const user = req.user;
        if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

        const group = await Group.create(req.body);
        return res.status(201).json({ success: true, group });
      } catch (err) {
        console.error('group.create error', err);
        return res.status(500).json({ success: false, error: 'Group creation failed' });
      }
    }
  ],

  getAll: async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

      const groups = await Group.find({ 'members.user': user.id })
        .populate('institution', 'name code')
        .populate('course', 'name code')
        .limit(50)
        .lean();

      return res.json({ success: true, groups });
    } catch (err) {
      console.error('group.getAll error', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve groups' });
    }
  },

  myGroups: async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

      const groups = await Group.find({ 'members.user': user.id })
        .populate('institution', 'name code')
        .populate('course', 'name code')
        .limit(50)
        .lean();

      return res.json({ success: true, groups });
    } catch (err) {
      console.error('group.myGroups error', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve groups' });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const group = await Group.findById(id)
        .populate('institution', 'name code')
        .populate('parentGroup', 'name type')
        .populate('course', 'name code')
        .populate('members.user', 'email role')
        .populate('admins', 'email role');

      if (!group) {
        return res.status(404).json({ success: false, error: 'Group not found' });
      }

      return res.json({ success: true, group });
    } catch (err) {
      console.error('group.getById error', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve group' });
    }
  },

  update: [
    validate(groupSchemas.update),
    async (req, res) => {
      try {
        const user = req.user;
        if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

        const { id } = req.params;
        const group = await Group.findByIdAndUpdate(id, req.body, { new: true });

        if (!group) {
          return res.status(404).json({ success: false, error: 'Group not found' });
        }

        return res.json({ success: true, group });
      } catch (err) {
        console.error('group.update error', err);
        return res.status(500).json({ success: false, error: 'Group update failed' });
      }
    }
  ],

  delete: async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

      const { id } = req.params;
      const group = await Group.findByIdAndDelete(id);

      if (!group) {
        return res.status(404).json({ success: false, error: 'Group not found' });
      }

      return res.json({ success: true, message: 'Group deleted successfully' });
    } catch (err) {
      console.error('group.delete error', err);
      return res.status(500).json({ success: false, error: 'Group deletion failed' });
    }
  },

  addMember: async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

      const { id } = req.params;
      const { userId, role = 'student' } = req.body;

      const group = await Group.findById(id);
      if (!group) {
        return res.status(404).json({ success: false, error: 'Group not found' });
      }

      // Check if user is already a member
      const existingMember = group.members.find(member => member.user.toString() === userId);
      if (existingMember) {
        return res.status(400).json({ success: false, error: 'User is already a member of this group' });
      }

      group.members.push({ user: userId, role, joinedAt: new Date() });
      await group.save();

      return res.json({ success: true, message: 'Member added successfully' });
    } catch (err) {
      console.error('group.addMember error', err);
      return res.status(500).json({ success: false, error: 'Failed to add member' });
    }
  },

  removeMember: async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

      const { id, memberId } = req.params;

      const group = await Group.findById(id);
      if (!group) {
        return res.status(404).json({ success: false, error: 'Group not found' });
      }

      group.members = group.members.filter(member => member.user.toString() !== memberId);
      await group.save();

      return res.json({ success: true, message: 'Member removed successfully' });
    } catch (err) {
      console.error('group.removeMember error', err);
      return res.status(500).json({ success: false, error: 'Failed to remove member' });
    }
  }
};
