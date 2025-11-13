const Course = require('../models/Course');

module.exports = {
  create: async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const course = await Course.create({
        ...req.body,
        createdBy: user.id
      });

      return res.status(201).json({ course });
    } catch (err) {
      console.error('course.create error', err);
      return res.status(500).json({ error: 'Failed to create course' });
    }
  },

  list: async (req, res) => {
    try {
      const query = {};
      if (req.query.institution) query.institution = req.query.institution;

      const courses = await Course.find(query).limit(100).lean();
      return res.json(courses);
    } catch (err) {
      console.error('course.list error', err);
      return res.status(500).json({ error: 'Failed to list courses' });
    }
  },

  getById: async (req, res) => {
    try {
      const course = await Course.findById(req.params.id).lean();
      if (!course) return res.status(404).json({ error: 'Course not found' });

      return res.json(course);
    } catch (err) {
      console.error('course.getById error', err);
      return res.status(500).json({ error: 'Failed to get course' });
    }
  },

  update: async (req, res) => {
    try {
      const course = await Course.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!course) return res.status(404).json({ error: 'Course not found' });

      return res.json({ course });
    } catch (err) {
      console.error('course.update error', err);
      return res.status(500).json({ error: 'Failed to update course' });
    }
  },

  delete: async (req, res) => {
    try {
      const course = await Course.findByIdAndDelete(req.params.id);
      if (!course) return res.status(404).json({ error: 'Course not found' });

      return res.json({ message: 'Course deleted successfully' });
    } catch (err) {
      console.error('course.delete error', err);
      return res.status(500).json({ error: 'Failed to delete course' });
    }
  }
};
