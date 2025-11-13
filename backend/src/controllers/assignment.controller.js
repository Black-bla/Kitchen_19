const Assignment = require('../models/Assignment');
const { assignmentSchemas } = require('../utils/validators');
const { uploadFile, deleteFile } = require('../services/storage.service');
const { send } = require('../services/notification.service');

module.exports = {
  // Create new assignment
  create: async (req, res) => {
    try {
      const { error, value } = assignmentSchemas.create.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      // Handle file uploads if any
      let attachments = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const result = await uploadFile(file.buffer, 'assignments');
          attachments.push(result.secure_url);
        }
      }

      const assignment = new Assignment({
        ...value,
        attachments,
        createdBy: req.user.id
      });

      await assignment.save();

      // Notify students in the group/subject
      if (assignment.group) {
        await send({
          title: 'New Assignment',
          body: `New ${assignment.type}: ${assignment.title}`,
          type: 'assignment',
          recipients: assignment.group,
          data: { assignmentId: assignment._id }
        });
      }

      res.status(201).json({
        success: true,
        message: 'Assignment created successfully',
        data: assignment
      });
    } catch (error) {
      console.error('Create assignment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create assignment',
        error: error.message
      });
    }
  },

  // Get assignments by subject or group
  getBySubject: async (req, res) => {
    try {
      const { subjectId, groupId } = req.query;
      const { page = 1, limit = 10 } = req.query;

      const query = {};
      if (subjectId) query.subject = subjectId;
      if (groupId) query.group = groupId;

      const assignments = await Assignment.find(query)
        .populate('subject', 'name code')
        .populate('group', 'name')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Assignment.countDocuments(query);

      res.json({
        success: true,
        data: assignments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get assignments error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch assignments',
        error: error.message
      });
    }
  },

  // Update assignment
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { error, value } = assignmentSchemas.update.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      const assignment = await Assignment.findById(id);
      if (!assignment) {
        return res.status(404).json({
          success: false,
          message: 'Assignment not found'
        });
      }

      // Check if user is the creator or admin
      if (assignment.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this assignment'
        });
      }

      // Handle new file uploads
      let attachments = assignment.attachments || [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const result = await uploadFile(file.buffer, 'assignments');
          attachments.push(result.secure_url);
        }
      }

      Object.assign(assignment, { ...value, attachments });
      await assignment.save();

      res.json({
        success: true,
        message: 'Assignment updated successfully',
        data: assignment
      });
    } catch (error) {
      console.error('Update assignment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update assignment',
        error: error.message
      });
    }
  },

  // Delete assignment
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const assignment = await Assignment.findById(id);
      if (!assignment) {
        return res.status(404).json({
          success: false,
          message: 'Assignment not found'
        });
      }

      // Check if user is the creator or admin
      if (assignment.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this assignment'
        });
      }

      // Delete attachments from Cloudinary
      if (assignment.attachments && assignment.attachments.length > 0) {
        for (const url of assignment.attachments) {
          await deleteFile(url);
        }
      }

      // Delete submission files
      if (assignment.submissions && assignment.submissions.length > 0) {
        for (const submission of assignment.submissions) {
          if (submission.fileUrl) {
            await deleteFile(submission.fileUrl);
          }
        }
      }

      await Assignment.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Assignment deleted successfully'
      });
    } catch (error) {
      console.error('Delete assignment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete assignment',
        error: error.message
      });
    }
  },

  // Submit assignment
  submit: async (req, res) => {
    try {
      const { id } = req.params;
      const { error, value } = assignmentSchemas.submit.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      const assignment = await Assignment.findById(id);
      if (!assignment) {
        return res.status(404).json({
          success: false,
          message: 'Assignment not found'
        });
      }

      // Check if assignment is still open
      if (new Date() > assignment.dueDate) {
        return res.status(400).json({
          success: false,
          message: 'Assignment submission deadline has passed'
        });
      }

      // Check if student already submitted
      const existingSubmission = assignment.submissions.find(
        sub => sub.student.toString() === req.user.id
      );

      let fileUrl = null;
      if (req.file) {
        const result = await uploadFile(req.file.buffer, 'submissions');
        fileUrl = result.secure_url;
      }

      if (existingSubmission) {
        // Update existing submission
        if (existingSubmission.fileUrl) {
          await deleteFile(existingSubmission.fileUrl);
        }
        existingSubmission.submittedAt = new Date();
        existingSubmission.fileUrl = fileUrl;
      } else {
        // New submission
        assignment.submissions.push({
          student: req.user.id,
          submittedAt: new Date(),
          fileUrl
        });
      }

      await assignment.save();

      res.json({
        success: true,
        message: 'Assignment submitted successfully'
      });
    } catch (error) {
      console.error('Submit assignment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit assignment',
        error: error.message
      });
    }
  },

  // Grade submission
  grade: async (req, res) => {
    try {
      const { id, studentId } = req.params;
      const { error, value } = assignmentSchemas.grade.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      const assignment = await Assignment.findById(id);
      if (!assignment) {
        return res.status(404).json({
          success: false,
          message: 'Assignment not found'
        });
      }

      // Check if user is authorized (creator or admin)
      if (assignment.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to grade this assignment'
        });
      }

      const submission = assignment.submissions.find(
        sub => sub.student.toString() === studentId
      );

      if (!submission) {
        return res.status(404).json({
          success: false,
          message: 'Submission not found'
        });
      }

      submission.marks = value.marks;
      submission.feedback = value.feedback;

      await assignment.save();

      res.json({
        success: true,
        message: 'Submission graded successfully'
      });
    } catch (error) {
      console.error('Grade assignment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to grade submission',
        error: error.message
      });
    }
  },

  // Get submissions for an assignment (lecturer view)
  getSubmissions: async (req, res) => {
    try {
      const { id } = req.params;

      const assignment = await Assignment.findById(id)
        .populate('submissions.student', 'name email studentId')
        .populate('subject', 'name code')
        .populate('group', 'name');

      if (!assignment) {
        return res.status(404).json({
          success: false,
          message: 'Assignment not found'
        });
      }

      // Check if user is authorized
      if (assignment.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view submissions'
        });
      }

      res.json({
        success: true,
        data: {
          assignment: {
            _id: assignment._id,
            title: assignment.title,
            type: assignment.type,
            dueDate: assignment.dueDate,
            totalMarks: assignment.totalMarks,
            subject: assignment.subject,
            group: assignment.group
          },
          submissions: assignment.submissions
        }
      });
    } catch (error) {
      console.error('Get submissions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch submissions',
        error: error.message
      });
    }
  },

  // Get student's submissions (student view)
  getMySubmissions: async (req, res) => {
    try {
      const { subjectId } = req.query;

      const query = { 'submissions.student': req.user.id };
      if (subjectId) query.subject = subjectId;

      const assignments = await Assignment.find(query)
        .populate('subject', 'name code')
        .populate('group', 'name')
        .populate('createdBy', 'name')
        .select('title type dueDate totalMarks subject group submissions.$')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: assignments
      });
    } catch (error) {
      console.error('Get my submissions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch submissions',
        error: error.message
      });
    }
  }
};
