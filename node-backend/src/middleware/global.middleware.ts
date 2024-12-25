import type, { Request, Response, NextFunction } from 'express';
import { HttpExceptions } from '../utility/exceptionUtility';

/**
 *
 * This function is an global error middleware , that handle the all exception which are being thrown
 * @param error
 * @param req
 * @param res
 * @param next
 */

export const globalErrorHandler = (
  error: HttpExceptions,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const handleNormalError = () => {
    return res.status(500).json({
      message:
        'Interal Server Error , We will be Redirecting it after the issue is Fixed',
      statusCode: 500,
    });
  };

  const handleHttpExceptionError = () => {
    return res.status(error.getStatusCode()).json({
      message: error.getMessage(),
      statusCode: error.getStatusCode(),
    });
  };

  if (error instanceof HttpExceptions) {
    handleHttpExceptionError();
  } else {
    handleNormalError();
  }
};
