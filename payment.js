const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  admission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admission',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  method: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: [
      'credit_card', 
      'debit_card', 
      'upi', 
      'netbanking', 
      'wallet',
      'cash'
    ]
  },
  provider: {
    type: String,
    required: [true, 'Payment provider is required'],
    enum: [
      'razorpay',
      'stripe',
      'paypal',
      'cash'
    ]
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  description: String,
  feeBreakdown: {
    admissionFee: Number,
    annualCharges: Number,
    securityDeposit: Number,
    otherCharges: Number
  },
  refund: {
    amount: Number,
    reason: String,
    processedAt: Date,
    transactionId: String
  },
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

// Generate transaction ID before saving
paymentSchema.pre('save', function(next) {
  if (this.isNew && !this.transactionId) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.transactionId = `TXN${timestamp}${random}`;
  }
  next();
});

// Index for better query performance
paymentSchema.index({ user: 1 });
paymentSchema.index({ admission: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
