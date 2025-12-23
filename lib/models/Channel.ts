import { Schema, model, models, Types } from "mongoose";

const ChannelSchema = new Schema(
  {
    stationId: {
      type: Types.ObjectId,
      ref: "Station",
      required: true,
      index: true,
    },

    name: { type: String, required: true, trim: true },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      immutable: true,
    },

    description: String,
    coverImage: String,

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true, versionKey: false }
);

ChannelSchema.index({ slug: 1, stationId: 1 }, { unique: true });

export default models.Channel || model("Channel", ChannelSchema);
