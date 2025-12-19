import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      immutable: true,
    },
  },
  { timestamps: true, versionKey: false }
);

CategorySchema.index({ slug: 1 }, { unique: true });

export default models.Category || model("Category", CategorySchema);
