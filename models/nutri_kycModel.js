const mongoose = require('mongoose');
const { Schema } = mongoose;

const certificateSchema = new Schema({
    name: { type: String},
    image: { type: String},
    status : { type: String, enum: ['Pending', 'Verified', 'Rejected'], default:'Pending'  },
});

const aadharSchema = new Schema({
    aadharNumber: { type: String},
    frontImage: { type: String},
    backImage: { type: String},
    status : { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
});

const panSchema = new Schema({
    panNumber: { type: String},
    frontImage: { type: String},
    status : { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
});

const kycSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    aadhar: { type: aadharSchema},
    pan: { type: panSchema},
    certificates: [certificateSchema],
    status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default:'Pending' },
    rejectionReason: { type: String }, 
},{ timestamps: true }); 

const KYC = mongoose.model('KYC', kycSchema);

module.exports = KYC;
