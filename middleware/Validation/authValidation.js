const Joi = require('joi');

const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string()
  .trim()
  .required()
  .pattern(/(^\+91[0-9]{10}$)|(^[0-9]{10}$)/),
  name: Joi.string().required(),
  accountType: Joi.string().valid('User', 'Nutri').default('User')
});

const logInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  accountType: Joi.string().valid('User', 'Nutri').default('User')
});

const sendOtpSchema = Joi.object({
  phone: Joi.string()
  .trim()
  .required()
  .pattern(/(^\+91[0-9]{10}$)|(^[0-9]{10}$)/),
  accountType: Joi.string().valid('User', 'Nutri').default('User')
});

const mobileLoginSchema = Joi.object({
  phone: Joi.string().required(),
  otp: Joi.string().required(),
  accountType: Joi.string().valid('User', 'Nutri').default('User')
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

const updateFCMSchema = Joi.object({
  fcmToken: Joi.string().required()
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
    signUpMiddleware: validateSchema(signUpSchema),
    logInMiddleware: validateSchema(logInSchema),
    sendOtpMiddleware: validateSchema(sendOtpSchema),
    mobileLoginMiddleware: validateSchema(mobileLoginSchema),
    changePasswordMiddleware: validateSchema(changePasswordSchema),
    updateFCMMiddleware: validateSchema(updateFCMSchema)
  };