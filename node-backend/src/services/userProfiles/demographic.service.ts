import {
  IUserProfileDemographics,
  IUserProfileUpdateDemograhpics,
} from '../../interfaces/userProfile.interface';
import UserRepo from '../../repository/user.repo';
import UserProfileRepo from '../../repository/userProfile.repo';
import { DatabaseException } from '../../utility/exceptionUtility';
import { extractUserName, fetchUserId } from '../../mappers/userProfile.mapper';

class UserProfileService {
  private userProfileRepo: UserProfileRepo;
  private userRepo: UserRepo;

  constructor() {
    this.userProfileRepo = new UserProfileRepo();
    this.userRepo = new UserRepo();
  }

  /**
   * Creates demographic details for a user.
   *
   * @param {string} userId - The ID of the user.
   * @param {IUserProfileDemographics} validDemographics - Valid demographics data to be saved.
   * @throws {DatabaseException} - If the user is not found or the ID does not match the stored document.
   * @returns {Promise<any>} - The result of the demographic creation operation.
   */
  public async createDemogrpahicDetails(
    userId: string,
    validDemographics: IUserProfileDemographics
  ): Promise<any> {
    const isUser = await this.userRepo.getUserId(userId as string);

    if (!isUser) {
      throw new DatabaseException(
        null,
        `The ${userId} cannot be found on our system`
      );
    }

    const userUserId = await fetchUserId(isUser);

    if (!userUserId) {
      throw new DatabaseException(
        null,
        `The ${userId} Provided by the payload does not match with the Stored User Document : ${userUserId}`
      );
    }
    const username = extractUserName(isUser.email);
    const savedResult = await this.userProfileRepo.createDemographics(
      username,
      userId,
      validDemographics
    );
    return savedResult;
  }

  /**
   * Updates demographic details for a user.
   *
   * @param {string} userId - The ID of the user.
   * @param {IUserProfileUpdateDemograhpics} validDemographics - Valid demographics data to update.
   * @throws {DatabaseException} - If the user is not found, or the update fails.
   * @returns {Promise<{ isAcknowleged: boolean; matchCount: number }>} - Update status including acknowledgment and match count.
   */
  public updateDemographicDetails = async (
    userId: string,
    validDemographics: IUserProfileUpdateDemograhpics
  ): Promise<{ isAcknowleged: boolean; matchCount: number }> => {
    const getUser = await this.userRepo.getUserId(userId as string);

    if (!getUser) {
      throw new DatabaseException(
        null,
        `
        The User id : ${userId} does not exists on the Database System`
      );
    }

    const extractUserId = fetchUserId(getUser);

    if (!extractUserId || extractUserId === null || undefined) {
      throw new DatabaseException(
        null,
        `The UserId cannot be fetched out from the User Documents`
      );
    }

    const updateResult = await this.userProfileRepo.updateDemographics(
      userId as string,
      validDemographics as IUserProfileUpdateDemograhpics
    );
    const isAcknowleged = updateResult?.acknowledged;

    const matchCount = updateResult?.matchedCount;

    const isValidUpdate = isAcknowleged && matchCount > 0;

    if (!isValidUpdate) {
      throw new DatabaseException(
        400,
        `There was some issue while updating , Please Try again`
      );
    }

    return {
      isAcknowleged,
      matchCount,
    };
  };

  /**
   * Retrieves the demographic details of a user.
   *
   * @param {string} userId - The ID of the user.
   * @throws {DatabaseException} - If the user is not found in the system.
   * @returns {Promise<any>} - The demographic details of the user.
   */
  public async getUserDemographics(userId: string): Promise<any> {
    const isUser = await this.userRepo.getUserId(userId as string);

    if (!isUser) {
      throw new DatabaseException(
        null,
        `The given UserId : ${userId} Does not Exists on the System`
      );
    }

    const extractUserId = fetchUserId(isUser as any | object);

    const fetchUserDemographics =
      await this.userProfileRepo.getUserDemographics(extractUserId as string);

    return fetchUserDemographics;
  }
}

export default UserProfileService;
