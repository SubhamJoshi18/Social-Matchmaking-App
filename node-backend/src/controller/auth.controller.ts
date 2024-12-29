import type, { NextFunction, Request, Response } from 'express';
import {
  forgetBodySchema,
  loginSchema,
  registerSchema,
  verifyPasswordSchema,
} from '../validation/auth.validator';
import {
  ILoginBody,
  IRegisterBody,
  IResetPassword,
} from '../interfaces/auth.interface';
import {
  BadRequestException,
  DatabaseException,
  ValidationException,
} from '../utility/exceptionUtility';
import httpStatusCode from 'http-status-codes';
import { checkObjectLength } from '../utility/instanceUtility';
import { appLogger } from '../libs/logger';
import AuthService from '../services/auth.service';
import {
  genericErrorResponse,
  genericSuccessResponse,
} from '../utility/responseUtility';
import Joi, { string } from 'joi';
import { fetchUserId } from '../mappers/userProfile.mapper';
/**
 * Controller for handling authentication-related endpoints.
 */
class AuthController {
  /**
   * Instance of AuthService for handling business logic.
   * @private
   */
  private AuthService: AuthService = new AuthService();

  constructor() {
    this.AuthService = new AuthService();
  }

  /**
   * Handles user registration.
   * @param req - Express request object containing the user registration data.
   * @param res - Express response object.
   * @param next - Express next function for error handling.
   */
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
        'Validation Error',
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
        'User Registered Successfully',
        httpStatusCode.ACCEPTED
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * Handles user login.
   * @param req - Express request object containing user login credentials.
   * @param res - Express response object.
   * @param next - Express next function for error handling.
   */
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
        'Validation Error',
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
      const validPayload = JSON.parse(JSON.stringify(value));
      const response = await this.AuthService.loginService(validPayload);
      return genericSuccessResponse(res, response, 'Login Successfully', 201);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Handles forgot password requests by sending a password reset link.
   * @param req - Express request object containing the user's email.
   * @param res - Express response object.
   * @param next - Express next function for error handling.
   */
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
        'Password Reset Link Forwarded',
        201
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * Verifies the validity of a reset password link.
   * @param req - Express request object containing the token parameter.
   * @param res - Express response object.
   * @param next - Express next function for error handling.
   */
  public checkResetPasswordLink = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const tokenParams = req.params.token;
    if (!tokenParams) {
      return genericErrorResponse(
        res,
        'tokenParams',
        'The Token path parameter is required',
        403
      );
    }
    try {
      const response = await this.AuthService.checkPasswordLinkService(
        tokenParams
      );
      return genericSuccessResponse(
        res,
        response,
        response
          ? 'The Provided Reset Password Link is valid'
          : 'The Provided Reset Password Link is invalid',
        httpStatusCode.ACCEPTED
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * Resets the user's password.
   * @param req - Express request object containing the user ID and new password data.
   * @param res - Express response object.
   * @param next - Express next function for error handling.
   */
  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    const { error, value } = forgetBodySchema.validate(
      req.body as IResetPassword
    );
    if (error) {
      return genericErrorResponse(
        res,
        error.details,
        'Validation Error',
        httpStatusCode.BAD_REQUEST
      );
    }

    const userId = req.params.userId;
    if (!userId) {
      throw new BadRequestException(403, `The User Id Path Parameter is Empty`);
    }

    try {
      const validPayload = JSON.parse(JSON.stringify(value));
      const response = await this.AuthService.resetPasswordService(
        validPayload,
        userId
      );
      return genericSuccessResponse(
        res,
        response,
        'Password Reset Successfully',
        httpStatusCode.ACCEPTED
      );
    } catch (err) {
      next(err);
    }
  }

  public verifyPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { error, value } = verifyPasswordSchema.validate(req.body);
    if (error) {
      throw new DatabaseException(
        null,
        `The Requested Body Does not Match with the Validation Format`
      );
    }
    const userId = fetchUserId(req.user);

    try {
      const validPasswordBody = JSON.parse(
        JSON.stringify(value as { password: string })
      );
      const response = await this.AuthService.verifyPassword(
        validPasswordBody,
        userId
      );
      return genericSuccessResponse(
        res,
        response,
        `Password is Verified`,
        httpStatusCode.ACCEPTED
      );
    } catch (err) {
      next(err);
    }
  };
}

export default new AuthController();
