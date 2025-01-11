import { string } from 'joi';
import mongoose from 'mongoose';

const uuidTokenSchema = new mongoose.Schema(
  {
    uuidToken: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const tokenSchema = new mongoose.Schema(
  {
    uuidToken: {
      type: String,
      required: false,
    },

    blockListAccessToken: {
      type: String,
      required: false,
    },

    blockListRefreshToken: {
      type: String,
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
