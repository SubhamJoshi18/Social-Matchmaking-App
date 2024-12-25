import type, { Application } from 'express';
import authRouter from './auth.router';
import { handleNotFoundUrl } from '../handlers/routeHandler';
import { globalErrorHandler } from '../middleware/global.middleware';

export const serverRouter = (expressApplication: Application) => {
  expressApplication.use('/api', [authRouter]);

  expressApplication.all('*', handleNotFoundUrl as any);
  expressApplication.use(globalErrorHandler as any);
};
