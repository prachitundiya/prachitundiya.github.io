const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Admission validation rules
const validateAdmission = [
  body('standard')
    .isIn(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'])
    .withMessage('Please select a valid standard'),
  body('student.name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Student name is required'),
  body('student.birthDate')
    .isISO8601()
    .withMessage('Please provide a valid birth date'),
  body('student.aadhaarNumber')
    .matches(/^\d{12}$/)
    .withMessage('Please provide a valid 12-digit Aadhaar number'),
  body('parents.father.name')
    .trim()
    .isLength({ min: 2 })
    .withMessage("Father's name is required"),
  body('parents.father.mobile')
    .matches(/^\d{10}$/)
    .withMessage("Please provide a valid 10-digit mobile number for father"),
  body('parents.mother.name')
    .trim()
    .isLength({ min: 2 })
    .withMessage("Mother's name is required"),
  body('parents.mother.mobile')
    .matches(/^\d{10}$/)
    .withMessage("Please provide a valid 10-digit mobile number for mother"),
  handleValidationErrors
];

// Feedback validation rules
const validateFeedback = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('type')
    .isIn(['general', 'admission_process', 'technical_issue', 'suggestion', 'complaint', 'appreciation'])
    .withMessage('Please select a valid feedback type'),
  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateAdmission,
  validateFeedback,
  handleValidationErrors
};