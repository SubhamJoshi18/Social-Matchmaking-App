import User from '../database/mongodb/models/user.schema';
import { IUserProfileDemographics } from '../interfaces/userProfile.interface';
import UserRepo from '../repository/user.repo';
import UserProfileRepo from '../repository/userProfile.repo';
import { DatabaseException } from '../utility/exceptionUtility';

class UserProfileService {
  private userProfileRepo: UserProfileRepo;
  private userRepo: UserRepo;

  constructor() {
    this.userProfileRepo = new UserProfileRepo();
    this.userRepo = new UserRepo();
  }

  public async createDemogrpahicDetails(
    userId: string,
    validDemographics: IUserProfileDemographics
  ) {
    const { age, location, ethnicity, gender } = validDemographics;

    const isUser = await this.userRepo.getUserId(userId as string);

    if (!isUser) {
      throw new DatabaseException(
        null,
        `The ${userId} cannot be found on our system`
      );
    }

    


  }
}

export default UserProfileService;
