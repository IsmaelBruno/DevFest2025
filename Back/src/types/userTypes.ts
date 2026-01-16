import { Document } from "mongoose";

// Définition des rôles utilisateur
export type UserRole = "user" | "admin";

// Définition de l'interface utilisateur
export interface IUser extends Document {
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_active: boolean;
  otp: string, 
  otpVerification: boolean;
  created_at: Date;
  updated_at: Date;
}
