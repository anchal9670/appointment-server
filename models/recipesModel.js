const mongoose = require('mongoose');

const difficultyEnum = ['easy', 'medium', 'hard'];
const typeEnum = ['breakfast', 'lunch', 'dinner', 'snack'];
const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  fats: {
    type: Number,
    required: true,
  },
  proteins: {
    type: Number,
    required: true,
  },
  carbs: {
    type: Number,
    required: true,
  },
  prepTime: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String, 
    enum: difficultyEnum,
    required: true,
  },
  serves: {
    type: String,
    required: true,
  },
  ingredients: [{
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
  }],
  methods: {
    type: [String],
    required: true,
  },
  type: {
    type: String,
    enum: typeEnum,
    required: true,
  },
});

// Create the Recipe model
const Recipes = mongoose.model('Recipes', recipeSchema);

module.exports = Recipes;
