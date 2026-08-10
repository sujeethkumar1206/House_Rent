const express = require('express');
const router = express.Router();
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties
} = require('../controllers/propertyController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { propertyValidation } = require('../validators/propertyValidator');

// Specific routes before dynamic :id routes
router.get('/my/listings', protect, getMyProperties);

router.get('/', getProperties);
router.get('/:id', getProperty);
router.post('/', protect, upload.array('images', 10), propertyValidation, createProperty);
router.put('/:id', protect, upload.array('images', 10), updateProperty);
router.delete('/:id', protect, deleteProperty);

module.exports = router;
