import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      default: 'User',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    googleId: {
      type: String,
      sparse: true,
    },
    otp: {
      code: {
        type: String,
      },
      expiresAt: {
        type: Date,
      },
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to enforce conditional validation during save
UserSchema.pre('save', function (next) {
  if (!this.googleId && !this.name) {
    return next(new Error('Name is required when Google ID is not provided.'));
  }
  next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
