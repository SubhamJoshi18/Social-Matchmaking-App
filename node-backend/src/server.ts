import type, { Application } from 'express';
import { appLogger } from './libs/logger';

class ExpressServer {
  public expressApplication: Application | null = null;
  public serverPort: number | null = null;

  constructor(expressApplication: Application, serverPort: number) {
    this.expressApplication = expressApplication;
    this.serverPort = serverPort;
  }

  /**
   * Starts the server and begins listening on the specified port.
   * @returns {Promise<void>}
   */
  public async listen() {
    this.expressApplication?.listen(this.serverPort, () => {
      appLogger.info(
        `Server is running on the http://localhost:${this.serverPort}`
      );
    });
  }
}

export default ExpressServer;
