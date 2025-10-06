const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicationId: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'waiting_list'],
    default: 'draft'
  },
  standard: {
    type: String,
    required: [true, 'Standard is required'],
    enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  },
  
  // Student Details
  student: {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true
    },
    birthDate: {
      type: Date,
      required: [true, 'Birth date is required']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true
    },
    nationality: {
      type: String,
      default: 'Indian'
    },
    photo: String,
    aadhaarNumber: {
      type: String,
      required: [true, 'Aadhaar number is required'],
      match: [/^\d{12}$/, 'Please provide a valid 12-digit Aadhaar number']
    }
  },
  
  // Parent Details
  parents: {
    father: {
      name: {
        type: String,
        required: [true, "Father's name is required"]
      },
      mobile: {
        type: String,
        required: [true, "Father's mobile number is required"],
        match: [/^\d{10}$/, 'Please provide a valid 10-digit mobile number']
      },
      email: String,
      occupation: String,
      aadhaarNumber: {
        type: String,
        match: [/^\d{12}$/, 'Please provide a valid 12-digit Aadhaar number']
      }
    },
    mother: {
      name: {
        type: String,
        required: [true, "Mother's name is required"]
      },
      mobile: {
        type: String,
        required: [true, "Mother's mobile number is required"],
        match: [/^\d{10}$/, 'Please provide a valid 10-digit mobile number']
      },
      email: String,
      occupation: String,
      aadhaarNumber: {
        type: String,
        match: [/^\d{12}$/, 'Please provide a valid 12-digit Aadhaar number']
      }
    }
  },
  
  // Contact Information
  address: {
    permanent: {
      address: String,
      city: String,
      state: String,
      pincode: String,
      country: {
        type: String,
        default: 'India'
      }
    },
    correspondence: {
      sameAsPermanent: {
        type: Boolean,
        default: true
      },
      address: String,
      city: String,
      state: String,
      pincode: String
    }
  },
  
  // Documents
  documents: {
    birthCertificate: String,
    leavingCertificate: String,
    previousMarksheet: String,
    addressProof: String,
    photoIdProof: String
  },
  
  // Previous School Information
  previousSchool: {
    name: String,
    address: String,
    board: String,
    grade: String,
    year: Number
  },
  
  // Medical Information
  medical: {
    bloodGroup: String,
    allergies: [String],
    conditions: [String],
    emergencyContact: {
      name: String,
      relation: String,
      mobile: String
    }
  },
  
  // Visit Information
  visitRequests: [{
    preferredDate: Date,
    preferredTime: String,
    purpose: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },
    scheduledDate: Date,
    notes: String
  }],
  
  // Payment Information
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  
  // Admin Fields
  adminNotes: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Generate application ID before saving
admissionSchema.pre('save', function(next) {
  if (this.isNew) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    this.applicationId = `APP${timestamp}${random}`;
  }
  next();
});

// Index for better query performance
admissionSchema.index({ user: 1 });
admissionSchema.index({ status: 1 });
admissionSchema.index({ applicationId: 1 });

module.exports = mongoose.model('Admission', admissionSchema);
