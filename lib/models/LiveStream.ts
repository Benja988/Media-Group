import { Schema, model, models, Types } from "mongoose";

const LiveStreamSchema = new Schema(
  {
    stationId: {
      type: Types.ObjectId,
      ref: "Station",
      required: true,
      index: true,
    },

    channelId: {
      type: Types.ObjectId,
      ref: "Channel",
    },

    type: {
      type: String,
      enum: ["radio", "tv"],
      required: true,
    },

    streamUrl: { type: String, required: true },

    isLive: { type: Boolean, default: false, index: true },

    startedAt: Date,
    endedAt: Date,
  },
  { timestamps: true, versionKey: false }
);

export default models.LiveStream || model("LiveStream", LiveStreamSchema);
