import User from '../database/mongodb/models/user.schema';
import { IRegisterBody } from '../interfaces/auth.interface';
import UserRepo from '../repository/user.repo';
import { DatabaseException } from '../utility/exceptionUtility';
import httpStatus from 'http-status-codes';
import BcryptHelper from '../helpers/bcryptHelper';
import { valid } from 'joi';
import { appLogger } from '../libs/logger';

class AuthService {
  private UserRepo: UserRepo | null = null;
  private bcryptHelper: BcryptHelper | null = null;

  constructor() {
    this.UserRepo = new UserRepo();
    this.bcryptHelper = new BcryptHelper();
  }

  /**
   *
   * This Function have the business logic to register the valid User
   * @param validBody
   */
  public async registerService(
    validBody: Required<IRegisterBody>
  ): Promise<any> {
    console.log(validBody);
    const { username, email, password } = validBody;
    console.log(username);

    const isUsernameExists = await this.UserRepo?.checkEmailExists(email);

    const isEmalExists = await this.UserRepo?.checkUserNameExists(username);

    appLogger.info(
      `Username and Email is valid for the ${username} and ${email}`
    );

    const isError = this.handleUserCredentials(
      isUsernameExists as boolean,
      isEmalExists as boolean
    );

    const { error } = isError;

    if (error) {
      throw new DatabaseException(httpStatus.CONFLICT, error);
    }

    const hashPassword = await this.bcryptHelper?.hashPassword(password);

    const registerPayload = {
      email: email,
      password: hashPassword as string,
      username: username,
    };
    const insertResult = await this.UserRepo?.registerUser(registerPayload);
    return insertResult;
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
}

export default AuthService;
