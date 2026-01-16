import mongoose, { model, Model, Schema } from "mongoose";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

const userSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },

  picture: {
    type: String,
    require: true,
  },

  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER,
  },
});

export const User = model("social-login", userSchema);

