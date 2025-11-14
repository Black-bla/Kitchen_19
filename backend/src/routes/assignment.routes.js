const router = require('express').Router();
const ctrl = require('../controllers/assignment.controller');
const auth = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { assignmentSchemas } = require('../utils/validators');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Create assignment (with file uploads)
router.post('/',
  auth,
  upload.array('attachments', 5), // Max 5 files
  validate(assignmentSchemas.create),
  ctrl.create
);

// Get assignments by subject/group
router.get('/', auth, ctrl.getBySubject);

// Update assignment (with file uploads)
router.put('/:id',
  auth,
  upload.array('attachments', 5),
  validate(assignmentSchemas.update),
  ctrl.update
);

// Delete assignment
router.delete('/:id', auth, ctrl.delete);

// Submit assignment (single file)
router.post('/:id/submit',
  auth,
  upload.single('submission'),
  validate(assignmentSchemas.submit),
  ctrl.submit
);

// Grade submission
router.post('/:id/grade/:studentId',
  auth,
  validate(assignmentSchemas.grade),
  ctrl.grade
);

// Get submissions for assignment (lecturer view)
router.get('/:id/submissions', auth, ctrl.getSubmissions);

// Get student's submissions (student view)
router.get('/my-submissions', auth, ctrl.getMySubmissions);

module.exports = router;
