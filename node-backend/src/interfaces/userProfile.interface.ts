enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

enum RelationShipEnum {
  Single = 'Single',
  Married = 'Married',
  Divorced = 'Divorced',
  Other = 'Other',
}

enum ChildrenPreferencesEnum {
  Yes = 'Yes',
  No = 'No',
  Maybe = 'Maybe',
}

interface IUserProfileDemographics {
  age: number;
  location: string;
  gender: Gender;
  ethnicity: string;
}

interface IUserProfileUpdateDemograhpics {
  age?: number;
  location?: string;
  gender?: Gender;
  ethnicity?: string;
}

interface IUserPreferences {
  relationshipPreferences: RelationShipEnum;
  childrenPreferences: ChildrenPreferencesEnum;
}

interface IUserPreferencesUpdate {
  relationshipPreferences?: RelationShipEnum;
  childrenPreferences?: string;
}

export {
  IUserProfileDemographics,
  IUserProfileUpdateDemograhpics,
  IUserPreferences,
  IUserPreferencesUpdate,
  RelationShipEnum,
  ChildrenPreferencesEnum,
};
