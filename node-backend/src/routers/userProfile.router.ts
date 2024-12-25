import { Request, Response, Router } from 'express';
import { verifyAuthTokenMiddleware } from '../middleware/authMiddleware/verifyToken.middleware';

const userProfileRouter: Router = Router();

userProfileRouter.get(
  '/test',
  verifyAuthTokenMiddleware,
  (req: Request, res: Response): void => {
    console.log(req.user);
    res.status(201).json({
      message: 'Testing',
    });
  }
);

export default userProfileRouter;
