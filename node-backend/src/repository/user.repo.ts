import User from '../database/mongodb/models/user.schema';
import { IRegisterBody } from '../interfaces/auth.interface';

class UserRepo {
  /**
   *
   * This function will check if the username exists or not in the database
   * @param username
   * @returns {boolean}
   */
  public async checkUserNameExists(username: string): Promise<boolean> {
    const result = await User.findOne({
      username: username,
    });

    return result === null
      ? false
      : Object.entries(result as object).length > 0;
  }

  /**
   * This Function will check if the email exists or not
   * @param email
   * @returns {boolean}
   */
  public async checkEmailExists(email: string): Promise<boolean> {
    const result = await User.findOne({
      email: email,
    });

    return result === null
      ? false
      : Object.entries(result as object).length > 0;
  }

  /**
   * This function will insert the register valid body
   * @param param0
   * @returns {Promise<any>}
   */
  public async registerUser({
    email,
    password,
    username,
  }: IRegisterBody): Promise<any> {
    const data = await User.create({
      email: email,
      password: password,
      username: username,
    });

    return data;
  }

  public async getUserInfo(username: string) {
    const document = await User.findOne({
      username: username,
    });
   
    return document;
  }
}

export default UserRepo;
