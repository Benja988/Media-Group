import { Schema, model, models, Types } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      immutable: true,
    },

    description: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: ["news", "podcast", "video", "show"],
      required: true,
      index: true,
    },

    parentId: {
      type: Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    order: {
      type: Number,
      default: 0,
      index: true,
    },

    seo: {
      title: String,
      description: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

CategorySchema.index({ slug: 1, type: 1 }, { unique: true });

CategorySchema.index({ type: 1, isActive: 1, order: 1 });

CategorySchema.index({ name: "text", description: "text" });

export default models.Category || model("Category", CategorySchema);
