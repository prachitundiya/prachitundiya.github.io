const express = require('express');
const {
  submitFeedback,
  getUserFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbackStats
} = require('../controllers/feedbackController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validateFeedback } = require('../middleware/Validation');

const router = express.Router();

router.post('/', optionalAuth, validateFeedback, submitFeedback);

router.use(protect);

router.route('/')
  .get(getUserFeedback);

router.route('/:id')
  .get(getFeedback)
  .put(updateFeedback)
  .delete(deleteFeedback);

router.get('/admin/stats', authorize('admin'), getFeedbackStats);

module.exports = router;