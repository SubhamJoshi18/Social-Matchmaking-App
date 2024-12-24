import joi from 'joi';

const registerSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
  username: joi.string().required(),
});

export { registerSchema };
