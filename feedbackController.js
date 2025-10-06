const Feedback = require('../models/feedback');
const { sendEmail } = require('../utils/emailService');

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Public
exports.submitFeedback = async (req, res, next) => {
  try {
    const { email, type, subject, message, rating, category } = req.body;

    const feedback = await Feedback.create({
      email,
      type,
      subject,
      message,
      rating,
      category,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      user: req.user ? req.user.id : undefined
    });

    // Send acknowledgment email
    await sendEmail(email, 'feedbackAcknowledgment', [subject]);

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        id: feedback._id,
        subject: feedback.subject,
        type: feedback.type,
        submittedAt: feedback.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user feedback
// @route   GET /api/feedback
// @access  Private
exports.getUserFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single feedback
// @route   GET /api/feedback/:id
// @access  Private
exports.getFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update feedback
// @route   PUT /api/feedback/:id
// @access  Private
exports.updateFeedback = async (req, res, next) => {
  try {
    let feedback = await Feedback.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Only allow updating certain fields
    const allowedUpdates = ['subject', 'message', 'rating', 'category'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Feedback updated successfully',
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private
exports.deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    await Feedback.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get feedback statistics (for admin)
// @route   GET /api/feedback/stats
// @access  Private/Admin
exports.getFeedbackStats = async (req, res, next) => {
  try {
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      }
    ]);

    const totalFeedback = await Feedback.countDocuments();
    const unresolved = await Feedback.countDocuments({ status: 'new' });

    res.status(200).json({
      success: true,
      data: {
        totalFeedback,
        unresolved,
        byType: stats
      }
    });
  } catch (error) {
    next(error);
  }
};