import type, { Router } from 'express';
import { param, validationResult } from 'express-validator';
import authController from '../controller/auth.controller';
import { validateParams } from '../middleware/paramvalidator.middleware';
import ratelimiter from '../middleware/rateLimit.middleware';
import { verifyAuthTokenMiddleware } from '../middleware/authMiddleware/verifyToken.middleware';
import {
  checkRoleExists,
  isUser,
} from '../middleware/authMiddleware/roles.middleware';
import { isUserActivated } from '../middleware/authMiddleware/checkActive.middleware';

const authRouter: Router = Router();

authRouter.post('/register', ratelimiter, authController.registerController);
authRouter.post('/login', ratelimiter, authController.loginUser);
authRouter.post('/forget-password', ratelimiter, authController.forgetPassword);

authRouter.get(
  '/checkResetPassword/:token/:userId',
  ratelimiter,
  param('token').isUUID(),
  param('userId').isString(),
  validateParams as any,
  authController.checkResetPasswordLink
);

authRouter.post(
  '/reset-password/:token/:userId',
  ratelimiter,
  param('token').isUUID(),
  param('userId').isString(),
  validateParams as any,
  authController.resetPassword
);

authRouter.get(
  '/verify-password',
  verifyAuthTokenMiddleware,
  checkRoleExists,
  isUser,
  isUserActivated,
  authController.verifyPassword
);



export default authRouter;
