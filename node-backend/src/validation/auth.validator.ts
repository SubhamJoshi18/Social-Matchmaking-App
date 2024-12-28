import Joi from 'joi';


const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.base': 'Password must be a string.',
    'string.min': 'Password must be at least 8 characters long.',
    'any.required': 'Password is required.',
  }),
  username: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Username must be a string.',
    'string.min': 'Username must be at least 3 characters long.',
    'string.max': 'Username must be no more than 30 characters long.',
    'any.required': 'Username is required.',
  }),
});


const loginSchema = Joi.object({
  username: Joi.string().optional().messages({
    'string.base': 'Username must be a string.',
  }),
  email: Joi.string().email().optional().messages({
    'string.base': 'Email must be a string.',
    'string.email': 'Email must be a valid email address.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.base': 'Password must be a string.',
    'string.min': 'Password must be at least 8 characters long.',
    'any.required': 'Password is required.',
  }),
});


const forgetBodySchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is required.',
  }),
});


const resetBodySchema = Joi.object({
  password: Joi.string().min(8).required().messages({
    'string.base': 'Password must be a string.',
    'string.min': 'Password must be at least 8 characters long.',
    'any.required': 'Password is required.',
  }),
});

export { registerSchema, loginSchema, forgetBodySchema, resetBodySchema };
