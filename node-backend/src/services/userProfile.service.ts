import User from '../database/mongodb/models/user.schema';
import { IUserProfileDemographics } from '../interfaces/userProfile.interface';
import UserProfileRepo from '../repository/userProfile.repo';

class UserProfileService {
  private userProfileRepo: UserProfileRepo;

  constructor() {
    this.userProfileRepo = new UserProfileRepo();
  }

  public async createDemogrpahicDetails(
    userId: string,
    validDemographics: IUserProfileDemographics
  ) {
    const { age, location, ethnicity, gender } = validDemographics;
    console.log(age, location, ethnicity, gender);
  }
}

export default UserProfileService;
