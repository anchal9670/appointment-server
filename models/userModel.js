const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  joinedOn: {
    type: Date,
    default: Date.now,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  profilePic: {
    type: String,
    default : null,
  },
  accountType: {
    type: String,
    enum: ['User', 'Nutri'],
    default: 'User',
  },
  nutri :{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Nutritionist',
  },
  goal : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
  },
  address : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
  },
  bmi: {
    type: String,
  },
  tbw: {
    type: String,
  },
  fcm : {
    type : String,
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
