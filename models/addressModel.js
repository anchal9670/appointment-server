const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  addressType: {
    type: String,
    required: true,
  },
  apartment: {
    type: String,
  },
  area: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
