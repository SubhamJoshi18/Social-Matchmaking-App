enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

interface IUserProfileDemographics {
  age: number;
  location: string;
  gender: Gender;
  ethnicity: string;
}

export { IUserProfileDemographics };
