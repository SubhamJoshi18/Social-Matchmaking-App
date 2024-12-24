import type, { Application } from 'express';
import { appLogger } from './libs/logger';
import serverMiddleware from './middleware/server.middleware';
import { serverRouter } from './routers/server.router';
import EnvHelper from './helpers/envHelper';
import connectMongoDB from './database/mongodb/connect';
import { isDockerEnabled } from './constants/flagConstant';

class ExpressServer {
  public expressApplication: Application | null = null;
  public serverPort: number | null = null;
  private envHelper: EnvHelper | null = null;

  constructor(expressApplication: Application, serverPort: number) {
    this.expressApplication = expressApplication;
    this.serverPort = serverPort;
    this.envHelper = new EnvHelper();
    serverMiddleware(this.expressApplication);
    serverRouter(this.expressApplication);
  }

  /**
   *  This Class Method is use to connect to the MongoDB
   * @returns {Promise<void>}
   */
  private async connectNosql() {
    let mongoUrl = '';

    if (isDockerEnabled) {
      mongoUrl = this.envHelper?.getEnvValue('DOCKER_MONGO_URL') as string;
    } else {
      mongoUrl = this.envHelper?.getEnvValue('MONGO_URL') as string;
    }

    return new Promise((resolve, reject) => {
      connectMongoDB(mongoUrl as string)
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Starts the server and begins listening on the specified port.
   * @returns {Promise<void>}
   */
  public async listen() {
    try {
      await this.connectNosql();

      this.expressApplication?.listen(this.serverPort, () => {
        appLogger.info(
          `Server is running on http://localhost:${this.serverPort}`
        );
      });
    } catch (error) {
      appLogger.error('Error connecting to MongoDB:', error);
    }
  }
}

export default ExpressServer;
