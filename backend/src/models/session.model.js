import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const sessionModel = mongoose.model("session", sessionSchema);
export default sessionModel;
