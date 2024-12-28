import joi from 'joi';

const userProfileDemographics = joi.object({
  age: joi.number().required(),
  location: joi.string().required(),
  gender: joi.string().required(),
  ethnicity: joi.string().required(),
});

const updateUserProfileDemographics = joi.object({
  age: joi.number().optional(),
  location: joi.string().optional(),
  gender: joi.string().optional(),
  ethnicity: joi.string().optional(),
});

const userPreferences = joi.object({
  relationshipPreferences: joi.string().required(),
  childrenPreferences: joi.string().required(),
});

const userUpdatePreferences = joi.object({
  relationshipPreferences: joi.string().optional(),
  childrenPreferences: joi.string().optional(),
});

export {
  userProfileDemographics,
  updateUserProfileDemographics,
  userPreferences,
  userUpdatePreferences,
};
