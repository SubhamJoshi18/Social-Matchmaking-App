import type, { Request, Response, NextFunction } from 'express';
import { RoleEnum } from '../../types/enums';
import { appLogger } from '../../libs/logger';
import { BadRequestException } from '../../utility/exceptionUtility';
import httpStatus from 'http-status-codes';

const allUserRole = [RoleEnum.ADMIN, RoleEnum.DEVELOPER, RoleEnum.USER];

const checkRoleExists = (req: Request, res: Response, next: NextFunction) => {
  let isValidUser = true;
  const userRole = req.user['role'];

  for (const [key, value] of Object.entries(req.user)) {
    if (key == 'role') {
      if (Array.isArray(userRole)) {
        const userAllFilter = userRole.filter((x: string) =>
          allUserRole.includes(x as RoleEnum)
        );
        if (userAllFilter.length == 0) {
          isValidUser = false;
        }
      }
    }
  }
  if (isValidUser) {
    appLogger.info(`The User Role is valid and exists User Role : ${userRole}`);
    next();
  }
};

const isUser = (req: Request, res: Response, next: NextFunction) => {
  const userRole = RoleEnum.USER;
  if (Array.isArray(req.user['role']) && req.user['role'].includes(userRole)) {
    next();
  } else {
    throw new BadRequestException(
      httpStatus.BAD_REQUEST,
      `The Requested User is not have the User Role`
    );
  }
};

export { isUser, checkRoleExists };
