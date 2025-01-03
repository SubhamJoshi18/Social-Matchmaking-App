import { Router } from 'express';
import { verifyAuthTokenMiddleware } from '../middleware/authMiddleware/verifyToken.middleware';
import {
  checkRoleExists,
  isUser,
} from '../middleware/authMiddleware/roles.middleware';
import { isUserActivated } from '../middleware/authMiddleware/checkActive.middleware';
import BlogController from '../controller/blogs/blog.controller';
import Blog from '../database/mongodb/models/blog.schema';

const blogRouter = Router();

blogRouter.post(
  '/user/blog',
  verifyAuthTokenMiddleware,
  checkRoleExists,
  isUser,
  isUserActivated,
  BlogController.createBlog
);

blogRouter.get(
  '/user/blog',
  verifyAuthTokenMiddleware,
  checkRoleExists,
  isUser,
  isUserActivated,
  BlogController.getAllUserBlog
);

blogRouter.get(
  '/user/blog/:blogId',
  verifyAuthTokenMiddleware,
  checkRoleExists,
  isUser,
  isUserActivated,
  BlogController.getUserBlogById
);

blogRouter.patch(
  '/user/blog/:blogId',
  verifyAuthTokenMiddleware,
  checkRoleExists,
  isUser,
  isUserActivated,
  BlogController.updateTheUserBlog
);

blogRouter.patch(
  '/user/blog/status/:blogId',
  verifyAuthTokenMiddleware,
  checkRoleExists,
  isUser,
  isUserActivated,
  BlogController.changeBlogStatus
);

export default blogRouter;
