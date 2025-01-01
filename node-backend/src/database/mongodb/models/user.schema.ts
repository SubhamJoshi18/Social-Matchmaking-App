import { required } from 'joi';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  username: {
    type: String,
    required: true,
    unique: true,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
  roles: {
    type: [String],
    enum: ['user', 'admin', 'developer'],
    default: ['user'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: false,
    },
  ],

  userProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProfile',
    required: false,
  },
});

const User = mongoose.model('User', userSchema);

export default User;
