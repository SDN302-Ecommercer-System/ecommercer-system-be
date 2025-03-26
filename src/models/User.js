import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
    },

    password: {
      type: String,
      required: [true, "password must be required"],
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    address: {
      type: String,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: false,
    },

    email: {
      type: String,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
      unique: [true, 'this email was existed'],
    },

    avatar: {
      type: String,
    },

    otpVerify: {
      type: String
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
