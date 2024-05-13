const Joi = require('joi');

const updateAvailabilitySchema = Joi.object({
    updates: Joi.array().items(
        Joi.object({
            day: Joi.string().valid('sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat').required(),
            time: Joi.string().required(),
            available: Joi.string().valid('Available', 'Not Available').required(),
            appointment: Joi.string().valid('Yes', 'No').required()
        })
    ).required()
});

const updateNutriProfileSchema = Joi.object({
    designation: Joi.string().required(),
    degree: Joi.array().items(Joi.string()).required(),
    description: Joi.string().required(),
    practiceDate: Joi.date().iso().required()
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
    updateSlotMiddleware : validateSchema(updateAvailabilitySchema),
    updateNutriProfileMiddleware : validateSchema(updateNutriProfileSchema)
}
  
