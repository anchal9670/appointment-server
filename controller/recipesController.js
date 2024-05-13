const Recipes = require('../models/recipesModel');
const sendResponse = require('../utils/sendResponse');

const addRecipe = async (req, res) => {
    try {
      const {
        title,
        image,
        calories,
        fats,
        proteins,
        carbs,
        prepTime,
        difficulty,
        serves,
        ingredients,
        methods,
        type,
      } = req.body;

      const newRecipe = new Recipes({
        title,
        image,
        calories,
        fats,
        proteins,
        carbs,
        prepTime,
        difficulty,
        serves,
        ingredients,
        methods,
        type,
      });

      await newRecipe.save();
      return sendResponse(res,201,'Recipes added successfully',newRecipe);
     
    } catch (error) {
      console.error(error);
      return sendResponse(res,500,'Internal Server Error');
    }
};

const getAllRecipes = async (req, res) => {
    try {
      // Retrieve all recipes from the database with specified fields
      const recipes = await Recipes.find({}, 'title image calories');
      return sendResponse(res,200,'Fetched Successfully', recipes);
    } catch (error) {
      console.error(error);
      sendResponse(res,500,'Internal Server Error');
    }
};

const getRecipeById = async (req, res) => {
    try {
      const { id } = req.params;

      // Validate the ID
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }

      const recipe = await Recipes.findById(id);
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
      return sendResponse(res,200,'Fetched Successfully',recipe);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {addRecipe, getAllRecipes , getRecipeById};
