import mongoose, { mongo } from 'mongoose';
import User from './user.schema';

const DemographicsSchema = new mongoose.Schema(
  {
    age: { type: Number, required: false },
    location: { type: String, required: false },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: false,
    },
    ethnicity: { type: String },
  },
  { _id: false }
);

const PreferencesSchema = new mongoose.Schema(
  {
    relationshipPreferences: {
      type: String,
      enum: ['Single', 'Married', 'Divorced', 'Other'],
      default: 'Single',
    },
    childrenPreferences: {
      type: String,
      enum: ['Yes', 'No', 'Maybe'],
      default: ' No',
    },
  },
  { _id: false }
);

const InterestsSchema = new mongoose.Schema(
  {
    hobbies: [{ type: String }],
    guiltyPleasures: [{ type: String }],
    otherInterests: [{ type: String }],
  },
  { _id: false }
);

const ViewsSchema = new mongoose.Schema(
  {
    politicalViews: { type: String, required: false },
    likes: [{ type: String, required: false }],
    dislikes: [{ type: String, required: false }],
  },
  { _id: false }
);

const UserProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    demographics: DemographicsSchema,
    preferences: PreferencesSchema,
    interests: InterestsSchema,
    views: ViewsSchema,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserProfile = mongoose.model('UserProfile', UserProfileSchema);
export default UserProfile;
