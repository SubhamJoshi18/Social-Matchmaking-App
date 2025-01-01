import type, { Application } from 'express';
import express from 'express';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';
import { corsConfig } from '../config/corsConfig';

/**
 *
 * This Function is use to configure all the middleware present project
 * @param expressApplication
 */
export const serverMiddleware = (expressApplication: Application) => {
  expressApplication.use(express.json());
  expressApplication.use(express.urlencoded({ extended: true }));
  expressApplication.use(cors(corsConfig as CorsOptions));
  expressApplication.use(morgan('dev'));
};

export default serverMiddleware;
