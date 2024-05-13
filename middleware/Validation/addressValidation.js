const Joi = require('joi');

const updateAddressSchema = Joi.object({
    addressType: Joi.string().valid('Primary', 'Secondary', 'Work').optional(),
    apartment: Joi.string().required(),
    area: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().length(6).required(),
    country: Joi.string().default('India'),
    phone: Joi.string().optional()
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
    addressMiddleware : validateSchema(updateAddressSchema),
}