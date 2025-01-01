import type, { Application } from 'express';
import authRouter from './auth.router';
import userProfileRouter from './userProfile.router';
import { handleNotFoundUrl } from '../handlers/routeHandler';
import { globalErrorHandler } from '../middleware/global.middleware';
import blogRouter from './blog.router';

export const serverRouter = (expressApplication: Application) => {
  expressApplication.use('/api', [authRouter, userProfileRouter, blogRouter]);

  expressApplication.all('*', handleNotFoundUrl as any);
  expressApplication.use(globalErrorHandler as any);
};
