import type, { Request, Response, NextFunction } from 'express';
import PreferencesService from '../../services/userProfiles/preferences.service';
import {
  userPreferences,
  userUpdatePreferences,
} from '../../validation/userProfile.validator';
import {
  genericErrorResponse,
  genericSuccessResponse,
} from '../../utility/responseUtility';
import httpStatus from 'http-status-codes';
import { checkObjectLength } from '../../utility/instanceUtility';
import {
  IUserPreferences,
  IUserPreferencesUpdate,
} from '../../interfaces/userProfile.interface';

class PreferencesController {
  private preferencesService: PreferencesService;

  constructor() {
    this.preferencesService = new PreferencesService();
  }

  private getUserId(user: object): any {
    if (user.hasOwnProperty('_id')) {
      return (user as any)._id;
    }
    return null;
  }

  public createPreferences = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { error, value } = userPreferences.validate(req.body.preferences);

    if (value) {
      return genericErrorResponse(
        res,
        error?.details,
        `Preferences Validation Error`,
        httpStatus.BAD_REQUEST
      );
    }

    const isValidObject = checkObjectLength(value as IUserPreferences);

    if (!isValidObject) {
      return genericErrorResponse(
        res,
        isValidObject,
        `The Requested Body is Empty, Joi Validator Cannot handle it...`,
        httpStatus.BAD_REQUEST
      );
    }

    const userId = this.getUserId(req.user);

    try {
      const validPreferencesBody = JSON.parse(
        JSON.stringify(value as IUserPreferences)
      );
      const response = await this.preferencesService.createPreferences(
        userId as string,
        validPreferencesBody as IUserPreferences
      );

      return genericSuccessResponse(
        res,
        response,
        `Preferences Created Successfully`,
        httpStatus.ACCEPTED
      );
    } catch (err) {
      next(err);
    }
  };

  public updatePreferences = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { error, value } = userUpdatePreferences.validate(
      req.body.preferences
    );

    if (value) {
      return genericErrorResponse(
        res,
        error?.details,
        `Preferences Validation Error`,
        httpStatus.BAD_REQUEST
      );
    }

    const isValidObject = checkObjectLength(value as IUserPreferences);

    if (!isValidObject) {
      return genericErrorResponse(
        res,
        isValidObject,
        `The Requested Body is Empty, Joi Validator Cannot handle it...`,
        httpStatus.BAD_REQUEST
      );
    }

    const userId = this.getUserId(req.user);

    try {
      const validUpdateBody = JSON.parse(
        JSON.stringify(value as IUserPreferencesUpdate)
      );
      const response = await this.preferencesService.updatePreferences(
        userId,
        validUpdateBody
      );
      return genericSuccessResponse(
        res,
        response,
        `Prefrences Updated Successfully`,
        httpStatus.ACCEPTED
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
    const userId = this.getUserId(req.user);
    if (!userId) {
      return genericErrorResponse(
        res,
        null,
        `The User Id is null or cannot be found`,
        httpStatus.BAD_REQUEST
      );
    }
    try {
      const resposne = await this.preferencesService.getUserPreferences(
        userId as string
      );
      return genericSuccessResponse(
        res,
        resposne,
        `User Preferences For : ${userId}`,
        httpStatus.ACCEPTED
      );
    } catch (err) {
      next(err);
    }
  };
}

export default new PreferencesController();
