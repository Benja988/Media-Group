import { Schema, model, models, Types } from "mongoose";

const StationSchema = new Schema(
  {
    mediaGroupId: {
      type: Types.ObjectId,
      ref: "MediaGroup",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      immutable: true,
    },

    type: {
      type: String,
      enum: ["radio", "tv"],
      required: true,
      index: true,
    },

    frequency: String, // radio only
    region: String,

    logoUrl: String,
    description: String,

    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active",
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true, versionKey: false }
);

StationSchema.index({ slug: 1, mediaGroupId: 1 }, { unique: true });

export default models.Station || model("Station", StationSchema);
