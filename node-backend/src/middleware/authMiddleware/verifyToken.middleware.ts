import type, { Request, Response, NextFunction } from 'express';
import { IHeaders } from '../../interfaces/header.interface';
import { appLogger } from '../../libs/logger';
import JwtHelper from '../../helpers/jwtHelper';
import { checkObjectLength } from '../../utility/instanceUtility';
import { connectionhttpStatus } from '../../constants/headersConstant';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const jwtHelper = new JwtHelper();

export const verifyAuthTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers['authorization'] ?? req.headers.authorization;

  const headerPayload = {
    authorization: authToken,
    connection: req.headers['connection'],
    host: req.headers['host'],
  };
  const checkIfConnectionAlive = connectionAlive(headerPayload as IHeaders);
  const checkIfConnectionHost = connectionHost(headerPayload as IHeaders);

  const validHeaders = checkIfConnectionAlive && checkIfConnectionHost;

  if (validHeaders) {
    try {
      const decodedPayload = await jwtHelper.verifyAccessToken(
        authToken as string
      );

      const checkPayloadLength = checkObjectLength(decodedPayload as object);
      if (checkPayloadLength) {
        req.user = decodedPayload;
        next();
      }
    } catch (err) {
      next(err);
    }
  }
};

const connectionAlive = (headers: IHeaders) => {
  const { connection } = headers;
  return connection.includes(connectionhttpStatus);
};

const connectionHost = (headers: IHeaders) => {
  const { host } = headers;
  if (host.startsWith('localhost')) {
    appLogger.info(
      `The Header is Validating From the Localhost , not AWS Amazon API Gateway`
    );
  }
  return host !== null;
};
