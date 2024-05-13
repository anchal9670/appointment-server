const mongoose = require('mongoose');

const nutritionistSchema = new mongoose.Schema({
  designation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Designation',
  },
  degree: {
    type: [String],
  },
  description: {
    type: String,
  },
  practice: {
    type: Date,
  },
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule',
  },
  treated: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  }],
  feedback: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feedback',
  }],
});

const Nutritionist = mongoose.model('Nutritionist', nutritionistSchema);

module.exports = Nutritionist ;
