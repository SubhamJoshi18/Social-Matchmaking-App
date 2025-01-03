import { string } from 'joi';
import mongoose from 'mongoose';
import { DEFAULT_CIPHERS } from 'tls';

const blogSchema = new mongoose.Schema(
  {
    type: [
      {
        type: String,
        required: false,
        default: 'Random',
      },
    ],

    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Draft', 'Archive', 'Deleted'],
      default: 'Active',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },

    like: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Like',
      required: false,
    },
    dislike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unlike',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model('Blog', blogSchema);
export default Blog
