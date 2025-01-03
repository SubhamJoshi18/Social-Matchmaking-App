import bcrypt from 'bcryptjs';

/**
 * A utility class for handling password hashing and verification using bcrypt.
 */
class BcryptHelper {
  /**
   * Generates a salt for hashing.
   * @returns {Promise<string>} A promise that resolves to a bcrypt-generated salt string.
   * @private
   */
  private async generateSalt(): Promise<string> {
    return await bcrypt.genSalt(10);
  }

  /**
   * Hashes a given password with bcrypt.
   * @param {string} password - The plain text password to hash.
   * @returns {Promise<string>} A promise that resolves to the hashed password. Returns an empty string if the password is empty.
   * @throws Will throw an error if hashing fails.
   */
  public async hashPassword(password: string): Promise<string> {
    const salt = await this.generateSalt();
    return password.length > 0 ? await bcrypt.hash(password, salt) : '';
  }

  /**
   * Compares a plain text password with a hashed password.
   * @param {string} password - The plain text password to compare.
   * @param {string} dbPassword - The hashed password stored in the database.
   * @returns {Promise<boolean>} A promise that resolves to `true` if the passwords match, otherwise `false`.
   */
  public async compareHash(
    password: string,
    dbPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, dbPassword);
  }
}

export default BcryptHelper;
