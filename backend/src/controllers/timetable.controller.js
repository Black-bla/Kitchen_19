const Timetable = require('../models/Timetable');

module.exports = {
  create: async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const timetable = await Timetable.create({
        ...req.body,
        createdBy: user.id
      });

      return res.status(201).json({ timetable });
    } catch (err) {
      console.error('timetable.create error', err);
      return res.status(500).json({ error: 'Failed to create timetable' });
    }
  },

  getAll: async (req, res) => {
    try {
      const query = {};
      if (req.query.group) query.group = req.query.group;
      if (req.query.academicYear) query.academicYear = req.query.academicYear;

      const timetables = await Timetable.find(query).limit(100).lean();
      return res.json(timetables);
    } catch (err) {
      console.error('timetable.getAll error', err);
      return res.status(500).json({ error: 'Failed to get timetables' });
    }
  },

  getById: async (req, res) => {
    try {
      const timetable = await Timetable.findById(req.params.id).lean();
      if (!timetable) return res.status(404).json({ error: 'Timetable not found' });

      return res.json(timetable);
    } catch (err) {
      console.error('timetable.getById error', err);
      return res.status(500).json({ error: 'Failed to get timetable' });
    }
  },

  getByGroup: async (req, res) => {
    try {
      const timetables = await Timetable.find({ group: req.params.groupId }).limit(50).lean();
      return res.json(timetables);
    } catch (err) {
      console.error('timetable.getByGroup error', err);
      return res.status(500).json({ error: 'Failed to get timetables for group' });
    }
  },

  update: async (req, res) => {
    try {
      const timetable = await Timetable.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!timetable) return res.status(404).json({ error: 'Timetable not found' });

      return res.json({ timetable });
    } catch (err) {
      console.error('timetable.update error', err);
      return res.status(500).json({ error: 'Failed to update timetable' });
    }
  },

  delete: async (req, res) => {
    try {
      const timetable = await Timetable.findByIdAndDelete(req.params.id);
      if (!timetable) return res.status(404).json({ error: 'Timetable not found' });

      return res.json({ message: 'Timetable deleted successfully' });
    } catch (err) {
      console.error('timetable.delete error', err);
      return res.status(500).json({ error: 'Failed to delete timetable' });
    }
  }
};
