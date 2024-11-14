import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const User = model("User", userSchema);

const passwordSchema = new Schema({
  website: { type: String, required: true },
  password: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});
passwordSchema.index({ website: 1, userId: 1 }, { unique: true });

export const Password = model("Password", passwordSchema);
