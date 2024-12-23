import { CorsOptions } from 'cors';
import EnvHelper from '../helpers/envHelper';
const envHelper = new EnvHelper();

export const corsConfig: CorsOptions = {
  origin: envHelper.getEnvValue('FRONTEND_URL') || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
};
