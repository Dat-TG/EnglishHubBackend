import mongoose from "mongoose";
import { IUser } from "../types/user";
const userSchema = new mongoose.Schema({
  name: {
    require: true,
    type: String,
    trim: true,
  },
  email: {
    require: true,
    type: String,
    trim: true,
    validate: {
      validator: (value: string) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(re);
      },
      message: "Please enter a valid email address",
    },
  },
  password: {
    require: true,
    type: String,
  },
  type: {
    type: String,
    default: "user",
  },
  avatar: {
    type: String,
    default: "",
  },
  accessToken: {
    type: String,
    default: "",
  },
  refreshToken: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
