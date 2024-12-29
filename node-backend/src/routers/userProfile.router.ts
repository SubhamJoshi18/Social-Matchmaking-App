import { Request, Response, Router } from 'express';
import { verifyAuthTokenMiddleware } from '../middleware/authMiddleware/verifyToken.middleware';
import {
  checkRoleExists,
  isUser,
} from '../middleware/authMiddleware/roles.middleware';
import { isUserActivated } from '../middleware/authMiddleware/checkActive.middleware';
import UserProfileController from '../controller/userProfiles/demographic.controller';
import InterestController from '../controller/userProfiles/interest.controller';
import PreferencesController from '../controller/userProfiles/preferences.controller';

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

userProfileRouter.post(
  '/user/prefrences',
  verifyAuthTokenMiddleware,
  checkRoleExists,
  isUser,
  isUserActivated,
  PreferencesController.createPreferences
);

userProfileRouter.patch(
  '/user/prefrences',
  verifyAuthTokenMiddleware,
  checkRoleExists,
  isUser,
  isUserActivated,
  PreferencesController.updatePreferences
);

userProfileRouter.get(
  '/user/prefrences',
  verifyAuthTokenMiddleware,
  checkRoleExists,
  isUser,
  isUserActivated,
  PreferencesController.getUserPreferences
);

userProfileRouter.post(
  '/user/interests',
  verifyAuthTokenMiddleware,
  checkRoleExists,
  isUser,
  isUserActivated,
  InterestController.createInterest
);

userProfileRouter.delete(
  '/user/interests',
  verifyAuthTokenMiddleware,
  checkRoleExists,
  isUser,
  isUserActivated,
  InterestController.deleteUserPreferences
);

userProfileRouter.get(
  '/user/interests',
  verifyAuthTokenMiddleware,
  checkRoleExists,
  isUser,
  isUserActivated,
  InterestController.getUserPreferences
);

export default userProfileRouter;
