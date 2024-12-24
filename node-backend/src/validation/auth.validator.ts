import joi from 'joi';

const registerSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
  username: joi.string().required(),
});

const loginSchema = joi.object({
  username: joi.string().optional(),
  email: joi.string().optional(),
  password: joi.string().min(8).required(),
});

export { registerSchema, loginSchema };
