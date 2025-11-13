const router = require('express').Router();
const ctrl = require('../controllers/assignment.controller');
const { validate } = require('../middleware/validation.middleware');
const { assignmentSchemas } = require('../utils/validators');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Create assignment (with file uploads)
router.post('/',
  upload.array('attachments', 5), // Max 5 files
  validate(assignmentSchemas.create),
  ctrl.create
);

// Get assignments by subject/group
router.get('/', ctrl.getBySubject);

// Update assignment (with file uploads)
router.put('/:id',
  upload.array('attachments', 5),
  validate(assignmentSchemas.update),
  ctrl.update
);

// Delete assignment
router.delete('/:id', ctrl.delete);

// Submit assignment (single file)
router.post('/:id/submit',
  upload.single('submission'),
  validate(assignmentSchemas.submit),
  ctrl.submit
);

// Grade submission
router.post('/:id/grade/:studentId',
  validate(assignmentSchemas.grade),
  ctrl.grade
);

// Get submissions for assignment (lecturer view)
router.get('/:id/submissions', ctrl.getSubmissions);

// Get student's submissions (student view)
router.get('/my-submissions', ctrl.getMySubmissions);

module.exports = router;
