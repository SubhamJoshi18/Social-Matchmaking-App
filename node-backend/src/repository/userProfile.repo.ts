import UserProfile from '../database/mongodb/models/userProfile.schema';
import { IUserProfileDemographics } from '../interfaces/userProfile.interface';

class UserProfileRepo {
  public async createDemographics(
    demographicPayload: IUserProfileDemographics
  ) {
    
  }
}

export default UserProfileRepo;
