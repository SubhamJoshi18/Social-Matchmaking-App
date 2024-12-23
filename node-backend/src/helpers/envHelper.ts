import dotenv from 'dotenv';
dotenv.config();

class EnvHelper {
  /**
   *  Check whether the env value is present or not
   * @param envValue
   */
  private checkEnv(envValue: string) {
    let isValidEnv = true;

    if (
      Object.entries(process.env).length === 0 &&
      process.env.constructor === Object
    ) {
      throw new Error('Environment file not found');
    }
    if (!process.env[envValue as string]) {
      isValidEnv = false;
      return isValidEnv;
    } else {
      return isValidEnv;
    }
  }

  /**
   * return the envValue from the .env
   * @param envValue
   */
  public getEnvValue(envValue: string) {
    return this.checkEnv(envValue) ? process.env[envValue] : '';
  }
}

export default EnvHelper;
