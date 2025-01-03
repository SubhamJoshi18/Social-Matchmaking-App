import { preferences } from 'joi';
import {
  IUserPreferences,
  IUserPreferencesUpdate,
} from '../../interfaces/userProfile.interface';
import {
  checkValidChildrenType,
  checkValidRelationShip,
} from '../../mappers/userProfile.mapper';
import UserRepo from '../../repository/user.repo';
import UserProfileRepo from '../../repository/userProfile.repo';
import { DatabaseException } from '../../utility/exceptionUtility';
import { checkBothValueTrue } from '../../utility/instanceUtility';

class PreferencesService {
  private userRepo: UserRepo;
  private userProfleRepo: UserProfileRepo;

  constructor() {
    this.userRepo = new UserRepo();
    this.userProfleRepo = new UserProfileRepo();
  }

  /**
   * Creates user preferences.
   *
   * @param {string} userId - The ID of the user.
   * @param {IUserPreferences} validPreferences - The valid preferences to save.
   * @throws {DatabaseException} - If the user does not exist or preferences are invalid.
   * @returns {Promise<any>} - The saved preferences.
   */
  public createPreferences = async (
    userId: string,
    validPreferences: IUserPreferences
  ): Promise<any> => {
    const { relationshipPreferences, childrenPreferences } = validPreferences;
    const getUser = await this.userRepo.getUserId(userId as string);

    if (!getUser) {
      throw new DatabaseException(
        null,
        `The User Does not Exists on the Documents`
      );
    }

    const isValidRelation = checkValidRelationShip(relationshipPreferences);
    const isValidChildrenType = checkValidChildrenType(childrenPreferences);
    const isValid = checkBothValueTrue(isValidChildrenType, isValidRelation);

    if (!isValid) {
      throw new DatabaseException(
        null,
        `Children Type or Relation Type is invalid or does not exists`
      );
    }

    const savedPreferences = await this.userProfleRepo.createPreferences(
      userId as string,
      validPreferences as IUserPreferences
    );

    return savedPreferences;
  };

  /**
   * Updates user preferences.
   *
   * @param {string} userId - The ID of the user.
   * @param {IUserPreferencesUpdate} validPreferences - The updated preferences.
   * @returns {Promise<any>} - The updated preferences or an error object.
   */
  public updatePreferences = async (
    userId: string,
    validPreferences: IUserPreferencesUpdate
  ): Promise<any> => {
    const updatedPreferences = await this.userProfleRepo.updatePreferences(
      userId as string,
      validPreferences as IUserPreferencesUpdate
    );

    const isAcknowleged = updatedPreferences.acknowledged;
    const matchCount = updatedPreferences.matchedCount > 0;
    const isValidUpdated = checkBothValueTrue(isAcknowleged, matchCount);

    return isValidUpdated
      ? updatedPreferences
      : { isAcknowleged: false, matchCount: 0 };
  };

  /**
   * Retrieves user preferences.
   *
   * @param {string} userId - The ID of the user.
   * @returns {Promise<any>} - The user preferences or a default message if not set.
   */
  public getUserPreferences = async (userId: string): Promise<any> => {
    const userPreferences = await this.userProfleRepo.getUserPreferences(
      userId as string
    );

    if (userPreferences?.userProfile) {
      return {
        userProfile: userPreferences.userProfile,
      };
    } else {
      return {
        userProfile:
          userPreferences === null
            ? {
                preferences: 'User Does not have Preferences',
              }
            : {},
      };
    }
  };
}

export default PreferencesService;
