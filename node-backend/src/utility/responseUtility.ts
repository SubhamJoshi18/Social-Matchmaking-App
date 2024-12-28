import type, { Response } from 'express';

/**
 *  This Function will handle the generic success response to the frontend
 * @param res
 * @param data
 * @param message
 * @param statusCode
 * @returns {any}
 */

const genericSuccessResponse = <T>(
  res: Response,
  data: T,
  message: string,
  statusCode: number
): any => {
  return res.status(statusCode).json({
    message: message,
    statusCode: statusCode,
    status: String(statusCode).startsWith('2') ? 'Good' : 'Bad',
    data,
  });
};

/**
 * This Function will handle the generic error response to the frontend
 * @param res
 * @param data
 * @param message
 * @param statusCode
 * @param errorTrace
 * @returns
 */

const genericErrorResponse = <T>(
  res: Response,
  data: T,
  message: any,
  statusCode: number,
  errorTrace = null
) => {
  return res.status(statusCode).json({
    message: message,
    data: data,
    errorTrace: errorTrace ? errorTrace : 'No Error Trace',
  });
};

export { genericSuccessResponse, genericErrorResponse };
