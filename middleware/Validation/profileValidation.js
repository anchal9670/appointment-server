const Joi = require('joi');

// Joi schema for updateProfile function
const updateProfileSchema = Joi.object({
  name: Joi.string().optional(),
  dateOfBirth: Joi.date().iso().optional(),
  gender: Joi.string().valid('male', 'female', 'other').optional(),
  profilePic: Joi.string().uri().optional()
});

// certificate schema
const certificateSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().uri().required(),
    status: Joi.string().valid('Pending', 'Verified', 'Rejected').default('Pending')
});

// Joi schema for updateKYC function
const updateKYCSchema = Joi.object({
    panNumber: Joi.string().when({
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.forbidden()
    }),
    panFrontImage: Joi.string().uri().when('panNumber', {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.forbidden()
    }),
    aadharNumber: Joi.string().when({
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.forbidden()
    }),
    aadharFrontImage: Joi.string().uri().when('aadharNumber', {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.forbidden()
    }),
    aadharBackImage: Joi.string().uri().when('aadharNumber', {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.forbidden()
    }),
    certificates: Joi.array().items(certificateSchema).optional()
});

const kycVerifyRejectSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(), // objectId
  documentType: Joi.string().valid('aadhar', 'pan', 'certificate').required(),
  index: Joi.when('documentType', {
    is: 'certificate',
    then: Joi.number().integer().min(0).required(),
    otherwise: Joi.forbidden()
  })
});


// Create a middleware function to validate request body
const validateSchema = (schema) => {
    return (req, res, next) => {
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      next(); 
    };
};

const paramsSchema = Joi.object({
  userId: Joi.string().hex().length(24).required()  //objectId
});


const showKYCSchema = Joi.object({
  userId: Joi.string().required().length(24).pattern(/^[0-9a-fA-F]{24}$/)
});

const validateParamsSchema = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next(); 
  };
};
// Define Joi schema for request body
const kycbodySchema = Joi.object({
  status: Joi.string().valid('Verified', 'Rejected').required() 
});

const validateBodyParamsSchema = (bodySchema, paramsSchema) => {
  return (req, res, next) => {
    // Validate request body
    if (bodySchema) {
      const { error: bodyError } = bodySchema.validate(req.body);
      if (bodyError) {
        return res.status(400).json({ message: bodyError.details[0].message });
      }
    }

    // Validate request params
    if (paramsSchema) {
      const { error: paramsError } = paramsSchema.validate(req.params);
      if (paramsError) {
        return res.status(400).json({ message: paramsError.details[0].message });
      }
    }
    next();
  };
};


module.exports = {
  updateProfileMiddleware : validateSchema(updateProfileSchema),
  showKYCMiddleware : validateParamsSchema(showKYCSchema),
  updateKYCMiddleware : validateSchema(updateKYCSchema),
  verifiedKYCMiddleware : validateBodyParamsSchema(kycbodySchema , paramsSchema),
  kycVerifyRejectMiddleware : validateSchema(kycVerifyRejectSchema),
};
