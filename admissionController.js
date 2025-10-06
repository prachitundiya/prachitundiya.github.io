const Admission = require('../models/Admission');
const Payment = require('../models/payment');
const { sendEmail } = require('../utils/emailService');

// @desc    Get all admissions for user
// @route   GET /api/admissions
// @access  Private
exports.getUserAdmissions = async (req, res, next) => {
  try {
    const admissions = await Admission.find({ user: req.user.id })
      .populate('payment', 'status amount transactionId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: admissions.length,
      data: admissions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single admission
// @route   GET /api/admissions/:id
// @access  Private
exports.getAdmission = async (req, res, next) => {
  try {
    const admission = await Admission.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('payment');

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }

    res.status(200).json({
      success: true,
      data: admission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new admission
// @route   POST /api/admissions
// @access  Private
exports.createAdmission = async (req, res, next) => {
  try {
    // Check if user already has a draft admission
    const existingDraft = await Admission.findOne({
      user: req.user.id,
      status: 'draft'
    });

    if (existingDraft) {
      return res.status(400).json({
        success: false,
        message: 'You already have a draft admission. Please complete or delete it first.'
      });
    }

    req.body.user = req.user.id;
    const admission = await Admission.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Admission created successfully',
      data: admission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update admission
// @route   PUT /api/admissions/:id
// @access  Private
exports.updateAdmission = async (req, res, next) => {
  try {
    let admission = await Admission.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }

    // Don't allow updates if admission is submitted
    if (admission.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update submitted admission'
      });
    }

    admission = await Admission.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Admission updated successfully',
      data: admission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit admission
// @route   PUT /api/admissions/:id/submit
// @access  Private
exports.submitAdmission = async (req, res, next) => {
  try {
    let admission = await Admission.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }

    if (admission.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Admission is already submitted'
      });
    }

    // Validate that all required fields are filled
    const requiredFields = [
      'standard',
      'student.name',
      'student.birthDate',
      'student.aadhaarNumber',
      'parents.father.name',
      'parents.father.mobile',
      'parents.mother.name',
      'parents.mother.mobile'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = field.split('.').reduce((obj, key) => obj && obj[key], admission);
      return !value;
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields before submitting',
        missingFields
      });
    }

    admission.status = 'submitted';
    await admission.save();

    // Send confirmation email
    await sendEmail(
      req.user.email,
      'admissionSubmitted',
      [req.user.name, admission.applicationId]
    );

    res.status(200).json({
      success: true,
      message: 'Admission submitted successfully',
      data: admission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Schedule school visit
// @route   POST /api/admissions/:id/visit
// @access  Private
exports.scheduleVisit = async (req, res, next) => {
  try {
    const admission = await Admission.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }

    const visitRequest = {
      preferredDate: req.body.preferredDate,
      preferredTime: req.body.preferredTime,
      purpose: req.body.purpose
    };

    admission.visitRequests.push(visitRequest);
    await admission.save();

    // Send visit confirmation email
    await sendEmail(
      req.user.email,
      'visitScheduled',
      [req.user.name, req.body.preferredDate, req.body.preferredTime]
    );

    res.status(200).json({
      success: true,
      message: 'Visit scheduled successfully',
      data: admission.visitRequests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete admission
// @route   DELETE /api/admissions/:id
// @access  Private
exports.deleteAdmission = async (req, res, next) => {
  try {
    const admission = await Admission.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }

    // Don't allow deletion of submitted admissions
    if (admission.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete submitted admission'
      });
    }

    await Admission.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Admission deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admission status
// @route   GET /api/admissions/:id/status
// @access  Private
exports.getAdmissionStatus = async (req, res, next) => {
  try {
    const admission = await Admission.findOne({
      _id: req.params.id,
      user: req.user.id
    }).select('status applicationId standard createdAt');

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }

    res.status(200).json({
      success: true,
      data: admission
    });
  } catch (error) {
    next(error);
  }
};