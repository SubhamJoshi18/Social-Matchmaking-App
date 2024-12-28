import User from '../database/mongodb/models/user.schema';
import UserProfile from '../database/mongodb/models/userProfile.schema';
import {
  IUserPreferences,
  IUserPreferencesUpdate,
  IUserProfileDemographics,
  IUserProfileUpdateDemograhpics,
} from '../interfaces/userProfile.interface';

class UserProfileRepo {
  public async createDemographics(
    username: string,
    userId: string,
    demographicPayload: IUserProfileDemographics
  ) {
    const savedUserDemographics = UserProfile.create({
      demographics: {
        ...demographicPayload,
      },
      user: userId,
      name: username,
    });
    return savedUserDemographics;
  }

  public async updateDemographics(
    userId: string,
    demographicPayload: IUserProfileUpdateDemograhpics
  ) {
    const updateResult = await UserProfile.updateOne(
      {
        user: userId,
      },
      {
        ...demographicPayload,
      },
      {
        $new: true,
      }
    );

    return updateResult;
  }

  public async getUserDemographics(userId: string) {
    const userDemographics = await User.findOne({ _id: userId }).populate(
      'UserProfile',
      'demographics'
    );

    return userDemographics;
  }

  public async createPreferences(
    userId: string,
    validPreferences: IUserPreferences
  ) {
    const preferencesUser = UserProfile.create({
      preferences: {
        ...validPreferences,
        User: userId,
      },
    });
    const savedUserPreferences = await User.updateOne(
      {
        _id: userId,
      },
      {
        userProfile: (await preferencesUser)._id,
      }
    );
    return {
      savedUserPreferences,
      preferencesUser,
    };
  }

  public async updatePreferences(
    userId: string,
    validPreferences: IUserPreferencesUpdate
  ) {
    const updateUserPreferences = await UserProfile.updateOne(
      {
        user: userId,
      },
      {
        ...validPreferences,
      }
    );
    return updateUserPreferences;
  }
  public async getUserPreferences(userId: string) {
    const userPreferences = await User.findOne({ _id: userId }).populate(
      'UserProfile',
      'preferences'
    );

    return userPreferences;
  }
}

export default UserProfileRepo;
