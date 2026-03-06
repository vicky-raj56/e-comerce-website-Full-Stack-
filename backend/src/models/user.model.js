import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      requried: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "password must be atleast ^ charechtor"],
    },
    profilePic: {
      //cloudinary for upload pic
      type: String,
      default: "",
    },
    profilePicId: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    
    },
    token: {
      type: String,
      default: null,
    },
    isVerified : {
      type: Boolean,
      default: false,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    phoneNo: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("user", userSchema);
export default userModel;
