import type, { Router } from 'express';
import authController from '../controller/auth.controller';

const authRouter: Router = Router();

authRouter.post('/register', authController.registerController);

export default authRouter;
