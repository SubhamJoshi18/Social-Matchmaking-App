import { ObjectId } from 'mongoose';

interface IRegisterBody {
  email: string;
  password: string;
  username: string;
}

interface IPayloadBody {
  _id: ObjectId | string;
  email: string;
  username: string;
  role: string;
  isActive: string;
}

export { IRegisterBody, IPayloadBody };
