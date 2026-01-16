import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/userTypes"; 

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    is_active: { type: Boolean, default: true },
    otp: { type: String, required: false }, // Code OTP temporaire
    otpVerification: { type: Boolean, default: false }, // Vérification OTP
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model<IUser>("User", UserSchema);
