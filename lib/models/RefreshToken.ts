import { Schema, model, models } from "mongoose";

const RefreshTokenSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", index: true},
        token: { type: String, unique: true},
        expiresAt: Date,
        revoked: { type: Boolean, default: false },
    },
    { timestamps: true }
)

export default models.RefreshToken || model("RefreshToken", RefreshTokenSchema);