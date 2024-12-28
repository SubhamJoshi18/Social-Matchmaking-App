import {
  ILoginBody,
  IPayloadBody,
  IRegisterBody,
  IResetPassword,
} from '../interfaces/auth.interface';
import UserRepo from '../repository/user.repo';
import {
  BadRequestException,
  DatabaseException,
} from '../utility/exceptionUtility';
import httpStatus from 'http-status-codes';
import BcryptHelper from '../helpers/bcryptHelper';
import { appLogger } from '../libs/logger';
import JwtHelper from '../helpers/jwtHelper';
import UuidTokenRepo from '../repository/uuidToken.repo';
import { createRandomizeUuid } from '../utility/uuidUtility';
import EmailHelper from '../helpers/smtpHelper';

class AuthService {
  private UserRepo: UserRepo;
  private UuidTokenRepo: UuidTokenRepo;
  private bcryptHelper: BcryptHelper;
  private jwtHelepr: JwtHelper;
  private smtpHelper: EmailHelper;

  constructor() {
    this.UserRepo = new UserRepo();
    this.bcryptHelper = new BcryptHelper();
    this.jwtHelepr = new JwtHelper();
    this.UuidTokenRepo = new UuidTokenRepo();
    this.smtpHelper = new EmailHelper();
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

  public async forgetService(email: string) {
    const isValidEmail = await this.UserRepo.checkEmailExists(email);
    if (!isValidEmail) {
      throw new DatabaseException(
        httpStatus.NOT_FOUND,
        `${email} not found in the system. Please provide a valid email.`
      );
    }

    const userDocument = await this.UserRepo.getUserInfo(email);
    if (!userDocument) {
      throw new DatabaseException(
        httpStatus.BAD_REQUEST,
        'User not found in the system.'
      );
    }

    const userId = userDocument._id;
    const randomUuid = createRandomizeUuid();
    const insertResult = await this.UuidTokenRepo.uuidToken(
      userDocument.email,
      randomUuid
    );

    const resetUrl = `http://localhost:3000/api/reset-password/${insertResult.uuidToken}/${userId}`;
    const subject = 'Password Reset Request';
    const text = `Click the following link to reset your password: ${resetUrl}`;

    try {
      await this.smtpHelper.sendEmail(userDocument.email, subject, text);
      return 'Password reset email sent successfully.';
    } catch (error) {
      throw new DatabaseException(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Error sending password reset email. Please try again later.'
      );
    }
  }

  public async checkPasswordLinkService(uuidToken: string) {
    let isTokenValid = true;

    if (typeof uuidToken !== 'string') {
      return new BadRequestException(
        httpStatus.BAD_REQUEST,
        'The Provided Path Parameter is not a string'
      );
    }

    const isDuplicatedToken =
      await this.UuidTokenRepo.checkDuplicationUuidToken(uuidToken);

    if (!isDuplicatedToken) {
      const tokenData = await this.UuidTokenRepo.retriveToken(
        uuidToken as string
      );

      if (!tokenData) {
        throw new DatabaseException(
          httpStatus.BAD_GATEWAY,
          'The Uuid Token is invalid , Please try again'
        );
      }

      return tokenData !== null ? isTokenValid : !isTokenValid;
    }
  }

  public resetPasswordService = async (
    validPassword: IResetPassword,
    id: string
  ) => {
    const { password } = validPassword;

    const hashNewPassword = await this.bcryptHelper.hashPassword(password);

    const userDoc = await this.UserRepo.getUserId(id as string);

    if (!userDoc) {
      throw new DatabaseException(
        httpStatus.CONFLICT,
        `User Document Does not Exists on the System`
      );
    }

    const userOldPassword = userDoc.password;
    const checkOldPasswordMatch = await this.bcryptHelper.compareHash(
      password,
      userOldPassword
    );

    if (checkOldPasswordMatch) {
      throw new DatabaseException(
        httpStatus.BAD_REQUEST,
        'You have Entered Your Old Password , Please Enter a new one'
      );
    }

    const updatPayload = {
      password: hashNewPassword,
    };

    const updateResult = await this.UserRepo.updateUserInfo(
      id as string,
      updatPayload
    );
    if (updateResult.modifiedCount > 0 && updateResult.acknowledged) {
      return updateResult;
    }
  };

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

  private createAccessTokenAndRefreshToken = async (
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
