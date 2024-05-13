const Joi = require('joi');

const createDesignationSchema = Joi.object({
    designation: Joi.string().required(),
    fee: Joi.number().required(),
    discount: Joi.number().default(0)
});

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
    designationMiddleware : validateSchema(createDesignationSchema),
};
