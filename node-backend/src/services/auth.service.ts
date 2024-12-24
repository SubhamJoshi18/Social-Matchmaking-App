import User from '../database/mongodb/models/user.schema';
import {
  ILoginBody,
  IPayloadBody,
  IRegisterBody,
} from '../interfaces/auth.interface';
import UserRepo from '../repository/user.repo';
import { DatabaseException } from '../utility/exceptionUtility';
import httpStatus from 'http-status-codes';
import BcryptHelper from '../helpers/bcryptHelper';
import { valid } from 'joi';
import { appLogger } from '../libs/logger';
import { userInfo } from 'os';
import JwtHelper from '../helpers/jwtHelper';

class AuthService {
  private UserRepo: UserRepo;
  private bcryptHelper: BcryptHelper;
  private jwtHelepr: JwtHelper;

  constructor() {
    this.UserRepo = new UserRepo();
    this.bcryptHelper = new BcryptHelper();
    this.jwtHelepr = new JwtHelper();
  }
  /**
   *
   * This Function have the business logic to register the valid User
   * @param validBody
   */
  public async registerService(
    validBody: Required<IRegisterBody>
  ): Promise<any> {
    const { username, email, password } = validBody;
    console.log(validBody);

    const isEmalExists = await this.UserRepo?.checkEmailExists(email);

    const isUsernameExists = await this.UserRepo?.checkUserNameExists(username);

    if (isEmalExists || isUsernameExists) {
      const isError = this.handleUserCredentials(
        isUsernameExists as boolean,
        isEmalExists as boolean
      );

      const { error } = isError;

      if (error) {
        throw new DatabaseException(httpStatus.CONFLICT, error);
      }
    }

    appLogger.info(
      `Username and Email is valid for the ${username} and ${email}`
    );

    const hashPassword = await this.bcryptHelper?.hashPassword(password);

    const registerPayload = {
      email: email,
      password: hashPassword as string,
      username: username,
    };
    const insertResult = await this.UserRepo?.registerUser(registerPayload);
    return insertResult;
  }

  public async loginService(payload: ILoginBody) {
    const { password, username } = payload;

    const userDocument = await this.UserRepo.getUserInfo(username as string);

    if (!userDocument) {
      throw new DatabaseException(
        httpStatus.BAD_REQUEST,
        'Username or Email Does not match you provided , Please try a valid Username'
      );
    }
    const hashPassword = userDocument.password;

    const isPasswordMatch = await this.bcryptHelper.compareHash(
      password,
      hashPassword
    );

    if (!isPasswordMatch && typeof isPasswordMatch === 'boolean') {
      throw new DatabaseException(
        httpStatus.CONFLICT,
        'Password Does not Match '
      );
    }

    const payloadToken: Required<IPayloadBody> = {
      username: userDocument.username,
      email: userDocument.email,
      role: userDocument.roles,
      isActive: userDocument.isActive,
      _id: userDocument._id,
    };

    const { accessToken, refreshToken } =
      await this.createAccessTokenAndRefreshToken(payloadToken);

    return {
      ...payloadToken,
      accessToken,
      refreshToken,
    };
  }

  private handleUserCredentials(
    isUsernameExists: boolean,
    isEmalExists: boolean
  ) {
    const bothValid = isUsernameExists && isEmalExists;

    return bothValid
      ? {
          error: null,
        }
      : {
          error: `Username or Email already Exists , Please Try again a new credentials`,
        };
  }

  public createAccessTokenAndRefreshToken = async (
    userPayload: IPayloadBody
  ) => {
    const accessToken = await this.jwtHelepr.createAccessToken(userPayload);
    const refreshToken = await this.jwtHelepr.createRefreshToken(userPayload);
    return {
      accessToken,
      refreshToken,
    };
  };
}

export default AuthService;
