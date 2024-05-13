const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    time: { type: String, required: true },
    available: { type: String, enum: ['Available', 'Not Available'], required: true },
    appointment: { type: String, enum: ['Yes', 'No'] }
});

const scheduleSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    sun : [appointmentSchema],
    mon : [appointmentSchema],
    tue : [appointmentSchema],
    wed : [appointmentSchema],
    thu : [appointmentSchema],
    fri : [appointmentSchema],
    sat : [appointmentSchema] 
});

const ScheduleModel = mongoose.model('Schedule', scheduleSchema);

module.exports = ScheduleModel;
