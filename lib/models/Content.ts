import { Schema, model, models, Types } from "mongoose";

const ContentSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["news", "podcast", "video", "show"],
      required: true,
      index: true,
    },

    title: { type: String, required: true, trim: true },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      immutable: true,
    },

    description: String,

    mediaUrl: String,
    thumbnailUrl: String,
    duration: Number,

    stationId: {
      type: Types.ObjectId,
      ref: "Station",
      required: false,
      index: true,
    },

    channelId: {
      type: Types.ObjectId,
      ref: "Channel",
      index: true,
    },

    authorId: {
      type: Types.ObjectId,
      ref: "User",
      index: true,
    },

    categoryIds: [{ type: Types.ObjectId, ref: "Category" }],
    tagIds: [{ type: Types.ObjectId, ref: "Tag" }],

    status: {
      type: String,
      enum: ["draft", "scheduled", "published"],
      default: "draft",
      index: true,
    },

    publishedAt: Date,
    scheduledFor: Date,

    metrics: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
    },
  },
  { timestamps: true, versionKey: false }
);

ContentSchema.index({ slug: 1, stationId: 1 }, { unique: true });
ContentSchema.index({ type: 1, status: 1, publishedAt: -1 });

export default models.Content || model("Content", ContentSchema);
