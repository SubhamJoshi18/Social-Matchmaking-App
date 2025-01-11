import type, { Request, Response, NextFunction } from 'express';
import { appLogger } from '../../libs/logger';
import { BadRequestException } from '../../utility/exceptionUtility';
import httpStatus from 'http-status-codes';

const isUserActivated = (req: Request, res: Response, next: NextFunction) => {
  const userStatus = req.user['isActive'];
  if (userStatus) {
    appLogger.info(`The User is Activated`);
    next();
  } else {
    throw new BadRequestException(
      httpStatus.BAD_REQUEST,
      `User is De Activated , Please Activated Your Account First `
    );
  }
};

export { isUserActivated };
