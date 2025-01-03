import { IUserInterest } from '../../interfaces/userProfile.interface';
import { fetchUserId } from '../../mappers/userProfile.mapper';
import InterestService from '../../services/userProfiles/interest.service';
import { checkObjectLength } from '../../utility/instanceUtility';
import {
  genericErrorResponse,
  genericSuccessResponse,
} from '../../utility/responseUtility';
import { userInterest } from '../../validation/userProfile.validator';
import type, { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status-codes';

class InterestController {
  private interestService: InterestService;

  constructor() {
    this.interestService = new InterestService();
  }

  public createInterest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { error, value } = userInterest.validate(req.body.interests);

    if (error) {
      return genericErrorResponse(
        res,
        error.details,
        `Interest Validation Exceptions`,
        httpStatus.BAD_REQUEST
      );
    }

    const isValidObject = checkObjectLength(value as IUserInterest);

    if (!isValidObject) {
      return genericErrorResponse(
        res,
        isValidObject,
        `The Provided Requested Body is Empty or Invalid`,
        httpStatus.BAD_GATEWAY
      );
    }

    const userId = fetchUserId(req.user);

    try {
      const validUserInterest = JSON.parse(
        JSON.stringify(value as IUserInterest)
      );
      const response = await this.interestService.createInterest(
        userId as string,
        validUserInterest as IUserInterest
      );
      return genericSuccessResponse(
        res,
        response,
        `User Preferences Created Successfully`,
        httpStatus.CREATED
      );
    } catch (err) {
      next(err);
    }
  };

  public deleteUserPreferences = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = fetchUserId(req.user);
    try {
      const response = await this.interestService.deleteInterest(
        userId as string
      );
      return genericSuccessResponse(
        res,
        response,
        `User Preferences Deleted or Cleared Successfully`,
        httpStatus.CREATED
      );
    } catch (err) {
      next(err);
    }
  };

  public getUserPreferences = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = fetchUserId(req.user);
    try {
      const response = await this.interestService.getUserInterest(
        userId as string
      );
      return genericSuccessResponse(
        res,
        response,
        `User Preferences Fetches Successfully`,
        httpStatus.OK
      );
    } catch (err) {
      next(err);
    }
  };
}

export default new InterestController();
