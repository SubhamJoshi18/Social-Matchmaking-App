import Joi from 'joi';

const blogValidator = Joi.object({
  type: Joi.array().items(Joi.string().default('Random')).default(['Random']),

  title: Joi.string().required().messages({
    'string.empty': 'Title is required.',
  }),

  description: Joi.string().required().messages({
    'string.empty': 'Description is required.',
  }),

  status: Joi.string()
    .valid('Active', 'Draft', 'Archive', 'Deleted')
    .default('Active'),
});

const updateBlogValidator = Joi.object({
  type: Joi.array().items(Joi.string()),
  title: Joi.string().optional(),
  description: Joi.string().optional(),
});


export { blogValidator, updateBlogValidator };
