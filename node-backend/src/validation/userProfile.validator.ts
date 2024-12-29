import Joi from 'joi';

const genderEnum = Joi.string()
  .valid('male', 'female', 'non-binary', 'other')
  .required();

const userProfileDemographics = Joi.object({
  age: Joi.number().min(18).max(120).required().messages({
    'number.base': 'Age must be a number.',
    'number.min': 'Age must be at least 18.',
    'number.max': 'Age must be no more than 120.',
    'any.required': 'Age is required.',
  }),
  location: Joi.string().min(2).max(100).required().messages({
    'string.base': 'Location must be a string.',
    'string.min': 'Location must be at least 2 characters long.',
    'string.max': 'Location must be no more than 100 characters long.',
    'any.required': 'Location is required.',
  }),
  gender: genderEnum.messages({
    'string.base': 'Gender must be a string.',
    'any.required': 'Gender is required.',
  }),
  ethnicity: Joi.string().min(3).max(100).required().messages({
    'string.base': 'Ethnicity must be a string.',
    'string.min': 'Ethnicity must be at least 3 characters long.',
    'string.max': 'Ethnicity must be no more than 100 characters long.',
    'any.required': 'Ethnicity is required.',
  }),
});

const updateUserProfileDemographics = Joi.object({
  age: Joi.number().min(18).max(120).optional(),
  location: Joi.string().min(2).max(100).optional(),
  gender: genderEnum.optional(),
  ethnicity: Joi.string().min(3).max(100).optional(),
});

const userPreferences = Joi.object({
  relationshipPreferences: Joi.string()
    .valid('single', 'in a relationship', 'married')
    .required()
    .messages({
      'string.base': 'Relationship preferences must be a string.',
      'any.required': 'Relationship preferences are required.',
      'any.only':
        'Relationship preferences must be one of: single, in a relationship, married.',
    }),
  childrenPreferences: Joi.string()
    .valid('wants children', 'does not want children', 'unsure')
    .required()
    .messages({
      'string.base': 'Children preferences must be a string.',
      'any.required': 'Children preferences are required.',
      'any.only':
        'Children preferences must be one of: wants children, does not want children, unsure.',
    }),
});

const userUpdatePreferences = Joi.object({
  relationshipPreferences: Joi.string()
    .valid('single', 'in a relationship', 'married')
    .optional(),
  childrenPreferences: Joi.string()
    .valid('wants children', 'does not want children', 'unsure')
    .optional(),
});

const userInterest = Joi.object({
  hobbies: Joi.array().optional(),
  guiltyPleasures: Joi.array().optional(),
  otherInterests: Joi.array().optional(),
});

export {
  userProfileDemographics,
  updateUserProfileDemographics,
  userPreferences,
  userUpdatePreferences,
  userInterest,
};
