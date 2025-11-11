const Document = require('../models/Document');
const storage = require('../services/storage.service');

module.exports = {
  upload: async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: 'Unauthorized' });
      const file = req.file;
      if (!file) return res.status(400).json({ error: 'No file uploaded' });

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
        description: req.body.description || ''
      });
      return res.json({ document: doc });
    } catch (err) {
      console.error('document.upload error', err);
      return res.status(500).json({ error: 'upload failed' });
    }
  },

  get: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) return res.status(400).json({ error: 'missing id' });
      const doc = await Document.findById(id).lean();
      if (!doc) return res.status(404).json({ error: 'not found' });
      return res.json({ document: doc });
    } catch (err) {
      console.error('document.get error', err);
      return res.status(500).json({ error: 'failed' });
    }
  }
};
