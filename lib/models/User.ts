import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: [
        "super_admin",
        "group_admin",
        "station_admin",
        "editor",
        "contributor",
        "user",
      ],
      default: "user",
      index: true,
    },

    scope: {
      mediaGroupId: { type: Schema.Types.ObjectId, ref: "MediaGroup" },
      stationIds: [{ type: Schema.Types.ObjectId, ref: "Station" }],
    },

    profile: {
      firstName: String,
      lastName: String,
      avatarUrl: String,
    },

    emailVerified: { type: Boolean, default: false },

    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,

    isActive: { type: Boolean, default: true },

    lastLoginAt: Date,
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);
