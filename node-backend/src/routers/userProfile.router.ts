import { Request, Response, Router } from 'express';
import { verifyAuthTokenMiddleware } from '../middleware/authMiddleware/verifyToken.middleware';
import {
  checkRoleExists,
  isUser,
} from '../middleware/authMiddleware/roles.middleware';
import { isUserActivated } from '../middleware/authMiddleware/checkActive.middleware';
import UserProfileController from '../controller/userProfile.controller';

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

userProfileRouter.post(
  '/user/demographic',
  verifyAuthTokenMiddleware,
  checkRoleExists,
  isUser,
  isUserActivated,
  UserProfileController.createUserDemographics
);

userProfileRouter.patch(
  '/user/demographic',
  verifyAuthTokenMiddleware,
  checkRoleExists,
  isUser,
  isUserActivated,
  UserProfileController.updateDemographic
);

userProfileRouter.get(
  '/user/demographic',
  verifyAuthTokenMiddleware,
  checkRoleExists,
  isUser,
  isUserActivated,
  UserProfileController.getUserDemographics
);

export default userProfileRouter;
