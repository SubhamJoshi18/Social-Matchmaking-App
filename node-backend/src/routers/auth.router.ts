import type, { Router } from 'express';
import authController from '../controller/auth.controller';

const authRouter: Router = Router();

authRouter.post('/register', authController.registerController);
authRouter.post('/login', authController.loginUser);
authRouter.post('/forget-password', authController.forgetPassword);
authRouter.get(
  '/checkResetPassword/:token/:userId',
  authController.checkResetPasswordLink
);
authRouter.post('/reset-password/:token/:userId', authController.resetPassword);
export default authRouter;
