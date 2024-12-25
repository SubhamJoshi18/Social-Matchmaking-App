import { UuuidToken } from '../database/mongodb/models/token.schema';
import { createRandomizeUuid } from '../utility/uuidUtility';

class UuidTokenRepo {
  /**
   * This function insert the newly created uuid token for the forget password
   * @param email
   * @param uuidToken
   * @returns
   */
  public async uuidToken(email: string, uuidToken: string) {
    const isNotDuplicate = this.checkDuplicationUuidToken(uuidToken as string);
    if (!isNotDuplicate) {
      uuidToken = createRandomizeUuid();
    }
    const newResult = await UuuidToken.create({
      email: email,
      uuidToken: uuidToken,
    });
    return newResult;
  }

  public async retriveToken(uuidToken: string) {
    const token = await UuuidToken.findOne({
      uuidToken: uuidToken as string,
    });
    return token;
  }

  public async checkDuplicationUuidToken(uuidToken: string) {
    const isToken = await UuuidToken.findOne({
      uuidToken: uuidToken,
    });

    return !isToken || isToken === null ? true : false;
  }
}

export default UuidTokenRepo;
