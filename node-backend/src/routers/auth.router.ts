import type, { Router } from 'express';
import { param, validationResult } from 'express-validator';
import authController from '../controller/auth.controller';
import { validateParams } from '../middleware/paramvalidator.middleware';

const authRouter: Router = Router();

authRouter.post('/register', authController.registerController);
authRouter.post('/login', authController.loginUser);
authRouter.post('/forget-password', authController.forgetPassword);

authRouter.get(
  '/checkResetPassword/:token/:userId',
  param('token').isUUID(),
  param('userId').isString(),
  validateParams as any,
  authController.checkResetPasswordLink
);

authRouter.post(
  '/reset-password/:token/:userId',
  param('token').isUUID(),
  param('userId').isString(),
  validateParams as any,
  authController.resetPassword
);
export default authRouter;
