import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { genericErrorResponse } from '../utility/responseUtility';
import httpStatus from 'http-status-codes';

export const validateParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return genericErrorResponse(
      res,
      errors.array(),
      'Params is not valid',
      httpStatus.BAD_REQUEST
    );
  } else {
    next();
  }
};
