import { NextFunction, Request, Response } from 'express';
import UserProfileService from '../services/userProfile.service';
import {
  updateUserProfileDemographics,
  userProfileDemographics,
} from '../validation/userProfil.validator';
import {
  IUserProfileDemographics,
  IUserProfileUpdateDemograhpics,
} from '../interfaces/userProfile.interface';
import {
  genericErrorResponse,
  genericSuccessResponse,
} from '../utility/responseUtility';
import httpStatus from 'http-status-codes';
import { checkObjectLength } from '../utility/instanceUtility';
import { DatabaseException } from '../utility/exceptionUtility';

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
        `The Demographic for ${userId} is  Created `,
        httpStatus.ACCEPTED
      );
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  public async updateDemographic(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { error, value } = updateUserProfileDemographics.validate(
      req.body.demographic
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
      const validDemographic = JSON.parse(
        JSON.stringify(value as IUserProfileUpdateDemograhpics)
      );
      const resposne = await this.userProfileService.updateDemographicDetails(
        userId as string,
        validDemographic as IUserProfileUpdateDemograhpics
      );
      return genericSuccessResponse(
        res,
        resposne,
        `The Demographic for ${userId} is Updated `,
        httpStatus.ACCEPTED
      );
    } catch (err) {
      next(err);
    }
  }

  public async getUserDemographics(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userId = this.getUserId(req.user);
    if (!userId) {
      throw new DatabaseException(
        null,
        'The User Id is missing in the Header Payloads'
      );
    }
    try {
      const resposne = await this.userProfileService.getUserDemographics(
        userId as string
      );
      return genericSuccessResponse(
        res,
        resposne,
        `The Demographic for ${userId}`,
        httpStatus.ACCEPTED
      );
    } catch (err) {
      next(err);
    }
  }
}

export default new UserProfileController();
