import { Request, Response, Router } from 'express';
import { verifyAuthTokenMiddleware } from '../middleware/authMiddleware/verifyToken.middleware';
import {
  checkRoleExists,
  isUser,
} from '../middleware/authMiddleware/roles.middleware';
import { isUserActivated } from '../middleware/authMiddleware/checkActive.middleware';

const userProfileRouter: Router = Router();

userProfileRouter.get(
  '/test',
  verifyAuthTokenMiddleware,
  checkRoleExists,
  isUser,
  isUserActivated,
  (req: Request, res: Response): void => {
    console.log(req.user);
    res.status(201).json({
      message: 'Testing',
    });
  }
);

export default userProfileRouter;
