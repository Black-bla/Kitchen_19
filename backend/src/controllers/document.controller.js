const Document = require('../models/Document');
const storage = require('../services/storage.service');
const { validate, validateFile } = require('../middleware/validation.middleware');
const { documentSchemas, paginationSchemas } = require('../utils/validators');

module.exports = {
  upload: [
    validate(documentSchemas.upload),
    validateFile({ maxSize: 50 * 1024 * 1024, allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'video/mp4', 'image/jpeg', 'image/png', 'image/gif'] }),
    async (req, res) => {
      try {
        const user = req.user;
        if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'No file uploaded' });

        // Upload to storage service if necessary
        let uploaded = null;
        try {
          uploaded = await storage.uploadFile(file, 'documents');
        } catch (e) {
          console.warn('document upload failed:', e.message || e);
        }

        const doc = await Document.create({
          title: req.body.title || file.originalname || 'Untitled',
          type: req.body.type || (file.mimetype && file.mimetype.split('/')[1]) || 'pdf',
          url: (uploaded && uploaded.url) || (file.url || file.path || ''),
          fileSize: uploaded ? uploaded.bytes : (file.size || 0),
          uploadedBy: user.id,
          subject: req.body.subject,
          description: req.body.description || '',
          tags: req.body.tags || []
        });
        return res.json({ success: true, document: doc });
      } catch (err) {
        console.error('document.upload error', err);
        return res.status(500).json({ success: false, error: 'Upload failed' });
      }
    }
  ],

  get: [
    validate(paginationSchemas.idParam, 'params'),
    async (req, res) => {
      try {
        const { id } = req.params;
        const doc = await Document.findById(id).populate('uploadedBy', 'email').populate('subject', 'name code').lean();
        if (!doc) return res.status(404).json({ success: false, error: 'Document not found' });
        return res.json({ success: true, document: doc });
      } catch (err) {
        console.error('document.get error', err);
        return res.status(500).json({ success: false, error: 'Failed to retrieve document' });
      }
    }
  ],

  update: [
    validate(paginationSchemas.idParam, 'params'),
    validate(documentSchemas.update),
    async (req, res) => {
      try {
        const user = req.user;
        if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

        const { id } = req.params;
        const updates = req.body;

        const doc = await Document.findOneAndUpdate(
          { _id: id, uploadedBy: user.id },
          updates,
          { new: true }
        ).populate('uploadedBy', 'email').populate('subject', 'name code');

        if (!doc) return res.status(404).json({ success: false, error: 'Document not found or access denied' });

        return res.json({ success: true, document: doc });
      } catch (err) {
        console.error('document.update error', err);
        return res.status(500).json({ success: false, error: 'Update failed' });
      }
    }
  ],

  delete: [
    validate(paginationSchemas.idParam, 'params'),
    async (req, res) => {
      try {
        const user = req.user;
        if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

        const { id } = req.params;
        const doc = await Document.findOneAndDelete({ _id: id, uploadedBy: user.id });

        if (!doc) return res.status(404).json({ success: false, error: 'Document not found or access denied' });

        return res.json({ success: true, message: 'Document deleted successfully' });
      } catch (err) {
        console.error('document.delete error', err);
        return res.status(500).json({ success: false, error: 'Delete failed' });
      }
    }
  ],

  list: async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

      const { page = 1, limit = 20, subject, type } = req.query;
      const query = { uploadedBy: user.id };

      if (subject) query.subject = subject;
      if (type) query.type = type;

      const documents = await Document.find(query)
        .populate('subject', 'name code')
        .sort({ uploadedAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

      const total = await Document.countDocuments(query);

      return res.json({
        success: true,
        documents,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      console.error('document.list error', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve documents' });
    }
  }
};
