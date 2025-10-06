const Payment = require('../models/payment');
const Admission = require('../models/Admission');
const { sendEmail } = require('../utils/emailService');

// Fee structure based on standard
const feeStructure = {
  '1': { admissionFee: 5000, annualCharges: 12000 },
  '2': { admissionFee: 5000, annualCharges: 12000 },
  '3': { admissionFee: 5000, annualCharges: 12000 },
  '4': { admissionFee: 5000, annualCharges: 12000 },
  '5': { admissionFee: 5000, annualCharges: 12000 },
  '6': { admissionFee: 6000, annualCharges: 15000 },
  '7': { admissionFee: 6000, annualCharges: 15000 },
  '8': { admissionFee: 6000, annualCharges: 15000 },
  '9': { admissionFee: 7000, annualCharges: 18000 },
  '10': { admissionFee: 7000, annualCharges: 18000 },
  '11': { admissionFee: 8000, annualCharges: 20000 },
  '12': { admissionFee: 8000, annualCharges: 20000 }
};

// @desc    Get fee structure for standard
// @route   GET /api/payments/fee-structure/:standard
// @access  Private
exports.getFeeStructure = async (req, res, next) => {
  try {
    const standard = req.params.standard;
    
    if (!feeStructure[standard]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid standard'
      });
    }

    const fees = feeStructure[standard];
    const total = fees.admissionFee + fees.annualCharges;

    res.status(200).json({
      success: true,
      data: {
        standard,
        ...fees,
        total,
        breakdown: [
          { name: 'Admission Fee', amount: fees.admissionFee },
          { name: 'Annual Charges', amount: fees.annualCharges }
        ]
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create payment for admission
// @route   POST /api/payments
// @access  Private
exports.createPayment = async (req, res, next) => {
  try {
    const { admissionId, paymentMethod, provider } = req.body;

    // Check if admission exists and belongs to user
    const admission = await Admission.findOne({
      _id: admissionId,
      user: req.user.id
    });

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }

    // Check if admission is submitted
    if (admission.status !== 'submitted') {
      return res.status(400).json({
        success: false,
        message: 'Admission must be submitted before payment'
      });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ admission: admissionId });
    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'Payment already exists for this admission'
      });
    }

    // Calculate amount based on standard
    const fees = feeStructure[admission.standard];
    const amount = fees.admissionFee + fees.annualCharges;

    // Create payment record
    const payment = await Payment.create({
      admission: admissionId,
      user: req.user.id,
      amount,
      method: paymentMethod,
      provider,
      feeBreakdown: fees,
      description: `Admission fee for Standard ${admission.standard}`,
      status: 'pending'
    });

    // Update admission with payment reference
    admission.payment = payment._id;
    await admission.save();

    // For Razorpay integration, you would create an order here
    if (provider === 'razorpay') {
      // Razorpay order creation logic would go here
      // const razorpayOrder = await razorpay.orders.create({...});
      // payment.razorpayOrderId = razorpayOrder.id;
      // await payment.save();
    }

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process payment callback (for Razorpay, etc.)
// @route   POST /api/payments/callback
// @access  Public
exports.paymentCallback = async (req, res, next) => {
  try {
    const { order_id, payment_id, signature, status } = req.body;

    // Verify payment signature (for Razorpay)
    // const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
    //   .update(order_id + "|" + payment_id)
    //   .digest('hex');
    
    // if (generatedSignature !== signature) {
    //   return res.status(400).json({ success: false, message: 'Invalid signature' });
    // }

    // Find payment by order ID
    const payment = await Payment.findOne({ razorpayOrderId: order_id });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (status === 'captured') {
      payment.status = 'completed';
      payment.razorpayPaymentId = payment_id;
      payment.razorpaySignature = signature;
      
      await payment.save();

      // Update admission status
      await Admission.findByIdAndUpdate(payment.admission, {
        status: 'under_review'
      });

      // Send confirmation email
      const admission = await Admission.findById(payment.admission).populate('user');
      await sendEmail(
        admission.user.email,
        'paymentConfirmation',
        [admission.user.name, payment.transactionId, payment.amount]
      );

      return res.status(200).json({
        success: true,
        message: 'Payment completed successfully'
      });
    } else {
      payment.status = 'failed';
      await payment.save();

      return res.status(400).json({
        success: false,
        message: 'Payment failed'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:id
// @access  Private
exports.getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('admission', 'applicationId standard student.name');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user payments
// @route   GET /api/payments
// @access  Private
exports.getUserPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate('admission', 'applicationId standard student.name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update payment status (for admin)
// @route   PUT /api/payments/:id/status
// @access  Private/Admin
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};