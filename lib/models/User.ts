import { Schema, model, models, Types } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, trim: true },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },

    avatarUrl: String,

    role: {
      type: String,
      enum: [
        "super_admin",
        "media_admin",
        "station_admin",
        "editor",
        "presenter",
        "listener",
      ],
      default: "listener",
      index: true,
    },

    mediaGroupId: {
      type: Types.ObjectId,
      ref: "MediaGroup",
      index: true,
    },

    stationIds: [{ type: Types.ObjectId, ref: "Station" }],

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default models.User || model("User", UserSchema);
