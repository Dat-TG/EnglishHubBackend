import mongoose from "mongoose";
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
});

const User = mongoose.model("User", userSchema);
export default User;
