import { Schema, model, models, Types } from "mongoose";

const EngagementSchema = new Schema(
  {
    contentId: {
      type: Types.ObjectId,
      ref: "Content",
      required: true,
      index: true,
    },

    userId: {
      type: Types.ObjectId,
      ref: "User",
      index: true,
    },

    type: {
      type: String,
      enum: ["view", "like", "comment", "share"],
      required: true,
      index: true,
    },

    value: String,
  },
  { timestamps: true, versionKey: false }
);

EngagementSchema.index({ contentId: 1, type: 1, createdAt: -1 });

export default models.Engagement || model("Engagement", EngagementSchema);
