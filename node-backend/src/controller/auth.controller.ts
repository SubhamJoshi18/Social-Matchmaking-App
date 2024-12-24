import type, { NextFunction, Request, Response } from 'express';
import { registerSchema } from '../validation/auth.validator';
import { IRegisterBody } from '../interfaces/auth.interface';
import { ValidationException } from '../utility/exceptionUtility';
import httpStatusCode from 'http-status-codes';
import { checkObjectLength } from '../utility/instanceUtility';
import { appLogger } from '../libs/logger';
import AuthService from '../services/auth.service';
import { genericSuccessResponse } from '../utility/responseUtility';

class AuthController {
  private AuthService: AuthService | null = null;

  constructor() {
    this.AuthService = new AuthService();
  }

  public async registerController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { error, value } = registerSchema.validate(req.body as IRegisterBody);

    if (error) {
      return res.status(403).json({
        error: error.details,
      });
    }

    const checkValidObject = checkObjectLength(value as IRegisterBody);

    if (checkValidObject && typeof checkValidObject === 'boolean') {
      appLogger.info(
        `Status : ${checkValidObject} The Request Body provided by user is valid and clean.`
      );
    }
    try {
      const validBody = JSON.parse(JSON.stringify(value));

      const response = await this.AuthService?.registerService(validBody);
      return genericSuccessResponse(
        res,
        response,
        'User Registered SuccesssFully',
        httpStatusCode.ACCEPTED
      );
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
