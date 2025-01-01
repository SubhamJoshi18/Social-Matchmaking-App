import mongoose, { mongo } from 'mongoose';

const likeSchema = new mongoose.Schema({
  likeCount: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
});

const unlikeSchema = new mongoose.Schema({
  unlikeCount: {
    type: Number,
    default: 0,
  },

  unlikedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: true,
    },
  ],
});

const LikeModel = mongoose.model('Like', likeSchema);
const UnLikeModel = mongoose.model('Unlike', unlikeSchema);

export { LikeModel, UnLikeModel };
