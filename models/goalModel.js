const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    weight: {
        current: { type: Number, default: 0 },
        goal: { type: Number, default: 0 },
        unit: { type: String, default: 'kg' }
    },
    height: {
        goal: { type: Number, default: 0 },
        unit: { type: String, default: 'cm' }
    },
    calories: {
        goal: { type: Number, default: 0 },
        unit: { type: String, default: 'kcal' }
    },
    protein: {
        goal: { type: Number, default: 0 },
        unit: { type: String, default: 'g' }
    },
    fats: {
        goal: { type: Number, default: 0 },
        unit: { type: String, default: 'g' }
    },
    carbs: {
        goal: { type: Number, default: 0 },
        unit: { type: String, default: 'g' }
    },
    water: {
        goal: { type: Number, default: 0 },
        unit: { type: String, default: 'ml' }
    },
    steps: {
        goal: { type: Number, default: 0 },
        unit: { type: String, default: 'steps' }
    },
    sleep: {
        goal: { type: Number, default: 0 },
        unit: { type: String, default: 'hours' }
    }
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
