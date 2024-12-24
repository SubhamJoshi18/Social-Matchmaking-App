import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { IPayloadBody } from '../interfaces/auth.interface';
import EnvHelper from './envHelper';

/**
 * A helper class for managing JWT token generation and validation.
 */
class JwtHelper {
  private envHelper: EnvHelper | null = null;

  constructor() {
    this.envHelper = new EnvHelper();
  }

  /**
   * Creates an access token with a given payload.
   * @param {IPayloadBody} payloadDetails - The payload details to include in the token.
   * @returns {Promise<string>} - A promise that resolves to the generated access token.
   */
  public async createAccessToken(
    payloadDetails: IPayloadBody
  ): Promise<string> {
    const options: jwt.SignOptions = {
      issuer: 'Shubham',
      expiresIn: '1h',
    };
    const secretKey =
      this.envHelper?.getEnvValue('SECRET_KEY') ?? 'random_secret';

    const userPayload = JSON.parse(JSON.stringify(payloadDetails));

    return new Promise((resolve, reject) => {
      if (options && secretKey && userPayload) {
        jwt.sign(userPayload, secretKey, options, (err, token) => {
          if (err || !token) {
            return reject(
              new JsonWebTokenError('Token Credential Does Not Match')
            );
          }
          resolve(token);
        });
      } else {
        reject(
          new JsonWebTokenError(
            'Missing required parameters for token generation'
          )
        );
      }
    });
  }

  /**
   * Creates a refresh token with a given payload.
   * @param {IPayloadBody} payloadDetails - The payload details to include in the token.
   * @returns {Promise<string>} - A promise that resolves to the generated refresh token.
   */
  public async createRefreshToken(
    payloadDetails: IPayloadBody
  ): Promise<string> {
    const options: jwt.SignOptions = {
      issuer: 'Shubham',
      expiresIn: '7d', // Refresh tokens typically have a longer expiration period
    };
    const secretKey =
      this.envHelper?.getEnvValue('REFRESH_SECRET_KEY') ??
      'random_refresh_secret';

    const userPayload = JSON.parse(JSON.stringify(payloadDetails));

    return new Promise((resolve, reject) => {
      if (options && secretKey && userPayload) {
        jwt.sign(userPayload, secretKey, options, (err, token) => {
          if (err || !token) {
            return reject(
              new JsonWebTokenError('Refresh Token Credential Does Not Match')
            );
          }
          resolve(token);
        });
      } else {
        reject(
          new JsonWebTokenError(
            'Missing required parameters for refresh token generation'
          )
        );
      }
    });
  }
}

export default JwtHelper;
