import { Schema, model, models } from "mongoose";

const MediaGroupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      immutable: true,
    },

    description: {
      type: String,
      trim: true,
    },

    logoUrl: {
      type: String,
    },

    branding: {
      primaryColor: String,
      secondaryColor: String,
      websiteUrl: String,
    },

    contactInfo: {
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
      phone: String,
      address: String,
    },

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
  {
    timestamps: true,
    versionKey: false,
  }
);

/* Indexes */
/* MediaGroupSchema.index({ slug: 1 });
MediaGroupSchema.index({ status: 1 }); */

export default models.MediaGroup || model("MediaGroup", MediaGroupSchema);
  
