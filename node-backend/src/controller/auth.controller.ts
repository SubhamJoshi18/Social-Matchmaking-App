import type, { NextFunction, Request, Response } from 'express';
import {
  forgetBodySchema,
  loginSchema,
  registerSchema,
} from '../validation/auth.validator';
import { ILoginBody, IRegisterBody } from '../interfaces/auth.interface';
import { ValidationException } from '../utility/exceptionUtility';
import httpStatusCode from 'http-status-codes';
import { checkObjectLength } from '../utility/instanceUtility';
import { appLogger } from '../libs/logger';
import AuthService from '../services/auth.service';
import {
  genericErrorResponse,
  genericSuccessResponse,
} from '../utility/responseUtility';

class AuthController {
  private AuthService: AuthService = new AuthService();

  constructor() {
    this.AuthService = new AuthService();
  }
  public registerController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { error, value } = registerSchema.validate(req.body as IRegisterBody);

    if (error) {
      return genericErrorResponse(
        res,
        error.details,
        'Validation Error ',
        httpStatusCode.BAD_REQUEST
      );
    }

    const checkValidObject = checkObjectLength(value as IRegisterBody);

    if (checkValidObject && typeof checkValidObject === 'boolean') {
      appLogger.info(
        `Status : ${checkValidObject} The Request Body provided by user is valid and clean.`
      );
    }
    try {
      const validBody = JSON.parse(JSON.stringify(value));

      const response = await this.AuthService.registerService(validBody);
      return genericSuccessResponse(
        res,
        response,
        'User Registered SuccesssFully',
        httpStatusCode.ACCEPTED
      );
    } catch (err) {
      next(err);
    }
  };

  public loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { error, value } = loginSchema.validate(req.body as ILoginBody);
    if (error) {
      return genericErrorResponse(
        res,
        error.details,
        'Validation Error ',
        httpStatusCode.BAD_REQUEST
      );
    }

    const checkValidObject = checkObjectLength(value as ILoginBody);

    if (checkValidObject && typeof checkValidObject === 'boolean') {
      appLogger.info(
        `Status : ${checkValidObject} The Request Body provided by user is valid and clean.`
      );
    }

    try {
      const validPayload = JSON.parse(JSON.stringify(value as ILoginBody));
      const response = await this.AuthService.loginService(validPayload);
      return genericSuccessResponse(res, response, 'Login SuccesssFully', 201);
    } catch (err) {
      next(err);
    }
  };

  public forgetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { error, value } = forgetBodySchema.validate(
      req.body as { email: string }
    );

    if (error) {
      return genericErrorResponse(
        res,
        error.details,
        'Validation Error',
        httpStatusCode.BAD_REQUEST
      );
    }

    try {
      const response = await this.AuthService.forgetService(value);
      return genericSuccessResponse(
        res,
        response,
        'Passoword Reset Link Forwarded',
        201
      );
    } catch (err) {
      next(err);
    }
  };
}

export default new AuthController();
