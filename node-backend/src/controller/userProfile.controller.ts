import { NextFunction, Request, Response } from 'express';
import UserProfileService from '../services/userProfile.service';
import { userProfileDemographics } from '../validation/userProfil.validator';
import { IUserProfileDemographics } from '../interfaces/userProfile.interface';
import {
  genericErrorResponse,
  genericSuccessResponse,
} from '../utility/responseUtility';
import httpStatus from 'http-status-codes';
import { checkObjectLength } from '../utility/instanceUtility';
import { DatabaseException } from '../utility/exceptionUtility';
import { string } from 'joi';

class UserProfileController {
  private userProfileService: UserProfileService;

  constructor() {
    this.userProfileService = new UserProfileService();
  }

  private getUserId(user: object): any {
    if (user.hasOwnProperty('_id')) {
      return (user as any)._id;
    }
    return null;
  }

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
        'The Requested Object Demogrpahics is empty'
      );
    }

    const userId = this.getUserId(req.user);
    if (!userId) {
      throw new DatabaseException(
        null,
        'The User Id is missing in the Header Payloads'
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
        `The Demographic for ${userId} is Updated or Created `,
        httpStatus.ACCEPTED
      );
    } catch (err) {
      next(err);
    }
  };
}

export default new UserProfileController();
