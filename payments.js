const express = require('express');
const {
  getFeeStructure,
  createPayment,
  paymentCallback,
  getPayment,
  getUserPayments,
  updatePaymentStatus
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/fee-structure/:standard', protect, getFeeStructure);

router.use(protect);

router.route('/')
  .get(getUserPayments)
  .post(createPayment);

router.route('/:id')
  .get(getPayment);

router.post('/callback', paymentCallback);
router.put('/:id/status', authorize('admin'), updatePaymentStatus);

module.exports = router;