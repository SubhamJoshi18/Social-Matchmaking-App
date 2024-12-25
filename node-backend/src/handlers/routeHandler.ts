import type, { NextFunction, Request, Response } from 'express';

/**
 *
 * This function is use to handle the url which does not exists on the software
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const handleNotFoundUrl = (req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({
    message: `${req.originalUrl} You have Requested Does not Exists on the System , Please Enter a Valid Url`,
  });
};

export { handleNotFoundUrl };
