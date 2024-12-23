import express from 'express';
import EnvHelper from './helpers/envHelper';
import ExpressServer from './server';
import { convertIntoNumber } from './utility/instanceUtility';
import { appLogger } from './libs/logger';

const app = express();
const envHelper = new EnvHelper();
const port = envHelper.getEnvValue('PORT');

const server = new ExpressServer(app, convertIntoNumber(port));

const startExpressServer = async () => {
  let retryCount = 5;
  const retryDelay = 2000;

  while (retryCount > 0) {
    try {
      appLogger.info('Attempting to start the Express server...');
      await server.listen();
      appLogger.info('Express server started successfully! ');
      return;
    } catch (err) {
      retryCount--;
      appLogger.error(
        `Error starting the Express server. Retries left: ${retryCount}`
      );
      appLogger.error(err);

      if (retryCount === 0) {
        appLogger.error('All retry attempts failed. Exiting...');
        process.exit(1);
      }

      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
};

startExpressServer();
