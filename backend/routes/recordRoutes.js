const express = require('express');
const {
  getRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
} = require('../controllers/recordController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// @route   /api/records
router.route('/').get(getRecords).post(protect, createRecord);

// @route   /api/records/:id
router
  .route('/:id')
  .get(getRecord)
  .put(updateRecord)
  .delete(deleteRecord);

module.exports = router;
