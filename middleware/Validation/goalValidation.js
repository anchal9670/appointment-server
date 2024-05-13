const Joi = require('joi');

// Define Joi schema for the Goal model
const createOrUpdateGoalSchema = Joi.object({
    weight: Joi.object({
        current: Joi.number().default(0),
        goal: Joi.number().default(0),
        unit: Joi.string().valid('kg', 'lbs').default('kg')
    }).optional(),
    height: Joi.object({
        goal: Joi.number().default(0),
        unit: Joi.string().valid('cm', 'in').default('cm')
    }).optional(),
    calories: Joi.object({
        goal: Joi.number().default(0),
        unit: Joi.string().valid('kcal').default('kcal')
    }).optional(),
    protein: Joi.object({
        goal: Joi.number().default(0),
        unit: Joi.string().valid('g').default('g')
    }).optional(),
    fats: Joi.object({
        goal: Joi.number().default(0),
        unit: Joi.string().valid('g').default('g')
    }).optional(),
    carbs: Joi.object({
        goal: Joi.number().default(0),
        unit: Joi.string().valid('g').default('g')
    }).optional(),
    water: Joi.object({
        goal: Joi.number().default(0),
        unit: Joi.string().valid('ml', 'l').default('ml')
    }).optional(),
    steps: Joi.object({
        goal: Joi.number().default(0),
        unit: Joi.string().valid('steps').default('steps')
    }).optional(),
    sleep: Joi.object({
        goal: Joi.number().default(0),
        unit: Joi.string().valid('hours').default('hours')
    }).optional()
});

const updateBMITBWSchema = Joi.object({
    value: Joi.number().required(),
    type: Joi.string().valid('BMI', 'TBW').required()
});

// Create a middleware function to validate request body
const validateSchema = (schema) => {
    return (req, res, next) => {
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      console.log(1);
      next(); // Move to the next middleware or route handler
    };
};
  

module.exports = {
    createOrUpdateGoalMiddleware : validateSchema(createOrUpdateGoalSchema),
    updateBMITBWMiddleware : validateSchema(updateBMITBWSchema)
};
