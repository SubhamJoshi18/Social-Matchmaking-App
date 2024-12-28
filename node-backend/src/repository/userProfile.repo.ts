import User from '../database/mongodb/models/user.schema';
import UserProfile from '../database/mongodb/models/userProfile.schema';
import {
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
}

export default UserProfileRepo;
