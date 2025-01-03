import User from '../../database/mongodb/models/user.schema';
import { IUserInterest } from '../../interfaces/userProfile.interface';
import UserProfileRepo from '../../repository/userProfile.repo';
import UserRepo from '../../repository/user.repo';
import { DatabaseException } from '../../utility/exceptionUtility';
class InterestService {
  private userProfileRepo: UserProfileRepo;
  private userRepo: UserRepo;

  constructor() {
    this.userProfileRepo = new UserProfileRepo();
    this.userRepo = new UserRepo();
  }

  public createInterest = async (
    userId: string,
    validInterestBody: IUserInterest
  ) => {
    const userDoc = await this.userRepo.getUserId(userId as string);

    if (!userDoc || Object.values(userDoc).length === 0) {
      throw new DatabaseException(null, `The User Document Cannot be Found`);
    }

    const savedInterest = await this.userProfileRepo.createUserInterest(
      validInterestBody,
      userId as string
    );
    return savedInterest;
  };

  public deleteInterest = async (userId: string) => {
    return await this.userProfileRepo.clearUserInterest(userId as string);
  };

  public getUserInterest = async (userId: string) => {
    return await this.userProfileRepo.getUserInterest(userId as string);
  };
}

export default InterestService;
