const express = require('express');
const {
  getUserAdmissions,
  getAdmission,
  createAdmission,
  updateAdmission,
  submitAdmission,
  scheduleVisit,
  deleteAdmission,
  getAdmissionStatus
} = require('../controllers/admissionController');
const { protect } = require('../middleware/auth');
const { validateAdmission } = require('../middleware/Validation');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getUserAdmissions)
  .post(validateAdmission, createAdmission);

router.route('/:id')
  .get(getAdmission)
  .put(validateAdmission, updateAdmission)
  .delete(deleteAdmission);

router.put('/:id/submit', submitAdmission);
router.post('/:id/visit', scheduleVisit);
router.get('/:id/status', getAdmissionStatus);

module.exports = router;