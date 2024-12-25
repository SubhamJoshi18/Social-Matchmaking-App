import { string } from 'joi';
import mongoose from 'mongoose';

const uuidTokenSchema = new mongoose.Schema(
  {
    uuid_token: {
      type: string,
      required: false,
    },
    email: {
      type: string,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const tokenSchema = new mongoose.Schema(
  {
    uuid_token: {
      type: string,
      required: false,
    },

    block_list_access_token: {
      type: string,
      required: false,
    },
    block_list_refresh_token: {
      type: string,
      required: false,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },

  {
    timestamps: true,
  }
);

const Token = mongoose.model('Token', tokenSchema);
const UuuidToken = mongoose.model('UuidToken', uuidTokenSchema);

export { Token, UuuidToken };
