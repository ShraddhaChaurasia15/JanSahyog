const mongoose = require('mongoose');
const schemeSchema = new mongoose.Schema({

  name: {

    type:String,
    required: [true, 'Scheme name is required'],
    trim: true,
    unique: true
  },

  description: {
    type: String,
    required: [true, 'Scheme description is required']
  },
  category: {
    type: String,
    required: true,
    enum: ['Agriculture', 'Healthcare', 'Education', 'Housing', 'Employment', 'Social Welfare', 'Finance', 'Other']
  },

  benefits: {
    type: String,
    required: true
  },

  duration: {
    type: String,
    default: 'Ongoing'
  },
  eligibilityCriteria: {
    minAge: {
      type: Number,
      default: 0
    },
    maxAge: {
      type: Number,
      default: 120
    },
    maxIncome: {
      type: Number,
      default: Infinity
    },

    minIncome:{
      type: Number,
      default: 0
    },
    categories: [{
      type: String,
      enum: ['General', 'OBC', 'SC', 'ST', 'EWS', 'All']
    }],
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'All'],
      default: 'All'
    },
    states: [{
      type: String
    }]

  },
  requirements: [{
    type: String
  }],
  applicationDeadline: {
    type: Date
  },
  officialWebsite: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


schemeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});


module.exports = mongoose.model('Scheme', schemeSchema);