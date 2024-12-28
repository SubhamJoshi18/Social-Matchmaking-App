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

/**
 * Service class responsible for handling authentication-related business logic,
 * including user registration, login, password reset, and validation of authentication tokens.
 */
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
   * Registers a new user if the provided credentials (email and username) are valid and not already taken.
   * @param validBody - The user registration data, including email, username, and password.
   * @returns A promise resolving to the result of the user registration operation.
   * @throws {DatabaseException} If the email or username already exists.
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

  /**
   * Authenticates a user based on their username and password and returns authentication tokens.
   * @param payload - The login credentials, including username and password.
   * @returns A promise resolving to an object containing the user payload and authentication tokens (access token and refresh token).
   * @throws {DatabaseException} If the username does not exist or the password is incorrect.
   */
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

  /**
   * Initiates a password reset process by sending a reset link to the user's email.
   * @param email - The email address associated with the user requesting a password reset.
   * @returns A promise resolving to a success message indicating the email was sent.
   * @throws {DatabaseException} If the email does not exist or if there is an error sending the email.
   */
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

  /**
   * Validates the password reset token provided in the URL.
   * @param uuidToken - The UUID token from the password reset link.
   * @returns A promise resolving to the token data if valid, or a BadRequestException if invalid.
   * @throws {DatabaseException} If the token is invalid or duplicated.
   */
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

  /**
   * Resets the user's password using the new password provided.
   * @param validPassword - The new password to set for the user.
   * @param id - The user ID of the account whose password is being reset.
   * @returns A promise resolving to the result of the password update operation.
   * @throws {DatabaseException} If the user does not exist or if the new password matches the old password.
   */
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

  /**
   * Handles the validation of user credentials during registration, checking if either the username or email is already taken.
   * @param isUsernameExists - Whether the username already exists.
   * @param isEmalExists - Whether the email already exists.
   * @returns An object containing an error message if the credentials are invalid, or null if valid.
   */
  private handleUserCredentials(
    isUsernameExists: boolean,
    isEmalExists: boolean
  ) {
    const bothValid = isUsernameExists && isEmalExists;

    return bothValid
      ? { error: null }
      : {
          error: `Username or Email already Exists , Please Try again a new credentials`,
        };
  }

  /**
   * Creates an access token and a refresh token for the authenticated user.
   * @param userPayload - The payload containing user details for the token.
   * @returns A promise resolving to an object containing the generated access token and refresh token.
   */
  private createAccessTokenAndRefreshToken = async (
    userPayload: IPayloadBody
  ) => {
    const accessToken = await this.jwtHelepr.createAccessToken(userPayload);
    const refreshToken = await this.jwtHelepr.createRefreshToken(userPayload);
    return { accessToken, refreshToken };
  };
}

export default AuthService;
