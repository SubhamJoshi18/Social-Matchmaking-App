import { ObjectId } from 'mongoose';

interface IRegisterBody {
  email: string;
  password: string;
  username: string;
}

interface ILoginBody {
  password: string;
  username?: string;
}

interface IPayloadBody {
  _id: ObjectId | string | any;
  email: string;
  username: string;
  role: string[];
  isActive: boolean;
}

interface IResetPassword {
  password: string;
}

export { IRegisterBody, IPayloadBody, ILoginBody, IResetPassword };
