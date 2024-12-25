import mongoose from 'mongoose';
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

  /**
   * This Function will get the User Document Based on the Username
   * @param username
   * @returns
   */
  public async getUserInfo(username: string) {
    const document = await User.findOne({
      username: username,
    });

    return document;
  }

  public async getUserId(id: string | mongoose.Schema.Types.ObjectId) {
    const document = await User.findOne({
      _id: id as string | mongoose.Schema.Types.ObjectId,
    });
    return document;
  }

  public async updateUserInfo(
    userId: string,
    user: object
  ): Promise<mongoose.UpdateWriteOpResult> {
    const updateResult = await User.updateOne(
      {
        _id: userId as string,
      },
      { ...user },
      {
        $new: true,
      }
    );

    return updateResult;
  }
}

export default UserRepo;
