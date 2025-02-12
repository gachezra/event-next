import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  tickets: [{ type: String }],
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  registeredEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Events"
  }],
  favouriteEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Events"
  }],
}, {
  timestamps: true,
});

export const Users = mongoose.models.Users || mongoose.model("Users", userSchema);