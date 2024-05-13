const mongoose = require('mongoose');

const designationFeeSchema = new mongoose.Schema({
    designation: { type: String, required: true },
    fee: { type: Number, required: true },
    discount: { type: Number, default: 0 } 
});

const DesignationFee= mongoose.model('DesinationFee', designationFeeSchema);

module.exports = DesignationFee;
