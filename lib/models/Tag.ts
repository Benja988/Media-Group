import { Schema, model, models } from "mongoose";

const TagSchema = new Schema(
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

TagSchema.index({ slug: 1 }, { unique: true });

export default models.Tag || model("Tag", TagSchema);
