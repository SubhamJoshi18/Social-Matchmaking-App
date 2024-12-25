import joi from 'joi';

const userProfileDemographics = joi.object({
  age: joi.number().required(),
  location: joi.string().required(),
  gender: joi.string().required(),
  ethnicity: joi.string().required(),
});

export { userProfileDemographics };
