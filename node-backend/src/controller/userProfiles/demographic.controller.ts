import { NextFunction, Request, Response } from 'express';
import UserProfileService from '../../services/userProfiles/demographic.service';
import {
  updateUserProfileDemographics,
  userProfileDemographics,
} from '../../validation/userProfile.validator';
import {
  IUserProfileDemographics,
  IUserProfileUpdateDemograhpics,
} from '../../interfaces/userProfile.interface';
import {
  genericErrorResponse,
  genericSuccessResponse,
} from '../../utility/responseUtility';
import httpStatus from 'http-status-codes';
import { checkObjectLength } from '../../utility/instanceUtility';
import { DatabaseException } from '../../utility/exceptionUtility';
/**
 * @class UserProfileController
 * @description Controller to handle user profile demographics operations, including creation, update, and retrieval of demographics data.
 */
class UserProfileController {
  /**
   * Instance of the UserProfileService to handle business logic related to user profiles.
   * @type {UserProfileService}
   */
  public userProfileService: UserProfileService;

  constructor() {
    this.userProfileService = new UserProfileService();
  }

  /**
   * Extracts the user ID from the user object.
   * @private
   * @param {object} user - User object from the request.
   * @returns {any} The extracted user ID or null if not found.
   */
  private getUserId(user: object): any {
    if (user.hasOwnProperty('_id')) {
      return (user as any)._id;
    }
    return null;
  }

  /**
   * Handles the creation of user demographic data.
   * @public
   * @async
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
   * @returns {Promise<void>}
   */
  public createUserDemographics = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { error, value } = userProfileDemographics.validate(
      req.body.demographics as IUserProfileDemographics
    );

    if (error) {
      return genericErrorResponse(
        res,
        error.details,
        'Demographics Validation Error',
        httpStatus.BAD_REQUEST
      );
    }

    const isObjectValid = checkObjectLength(value as IUserProfileDemographics);

    if (!isObjectValid) {
      throw new DatabaseException(
        httpStatus.CONFLICT,
        'The Requested Object Demographics is empty'
      );
    }

    const userId = this.getUserId(req.user);
    if (!userId) {
      throw new DatabaseException(
        null,
        'The User ID is missing in the header payloads'
      );
    }

    try {
      const validDemographics = JSON.parse(JSON.stringify(value));
      const response = await this.userProfileService.createDemogrpahicDetails(
        userId as string,
        validDemographics as IUserProfileDemographics
      );
      return genericSuccessResponse(
        res,
        response,
        `The Demographic for ${userId} is Created `,
        httpStatus.ACCEPTED
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * Handles updating of user demographic data.
   * @public
   * @async
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
   * @returns {Promise<void>}
   */
  public updateDemographic = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { error, value } = updateUserProfileDemographics.validate(
      req.body.demographics
    );

    if (error) {
      return genericErrorResponse(
        res,
        error.details,
        'Demographics Validation Error',
        httpStatus.BAD_REQUEST
      );
    }

    const isObjectValid = checkObjectLength(
      value as IUserProfileUpdateDemograhpics
    );

    if (!isObjectValid) {
      throw new DatabaseException(
        httpStatus.CONFLICT,
        'The Requested Object Demographics is empty'
      );
    }

    const userId = req.user._id;
    if (!userId) {
      throw new DatabaseException(
        null,
        'The User ID is missing in the header payloads'
      );
    }

    try {
      const validDemographic = JSON.parse(
        JSON.stringify(value as IUserProfileUpdateDemograhpics)
      );

      const response = await this.userProfileService.updateDemographicDetails(
        userId as string,
        validDemographic as IUserProfileUpdateDemograhpics
      );
      return genericSuccessResponse(
        res,
        response,
        `The Demographic for ${userId} is Updated `,
        httpStatus.ACCEPTED
      );
    } catch (err) {
      console.log(err);
      if (err instanceof DatabaseException) {
        return genericErrorResponse(
          res,
          err,
          err.getMessage(),
          err.getStatusCode()
        );
      }

      next(err);
    }
  };

  /**
   * Retrieves user demographic data.
   * @public
   * @async
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
   * @returns {Promise<void>}
   */
  public getUserDemographics = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = this.getUserId(req.user);
    if (!userId) {
      throw new DatabaseException(
        null,
        'The User ID is missing in the header payloads'
      );
    }
    try {
      const response = await this.userProfileService.getUserDemographics(
        userId as string
      );
      return genericSuccessResponse(
        res,
        response,
        `The Demographic for ${userId}`,
        httpStatus.ACCEPTED
      );
    } catch (err) {
      next(err);
    }
  };
}

export default new UserProfileController();
