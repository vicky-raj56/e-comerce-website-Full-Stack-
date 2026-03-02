import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongoDb is connected");
  } catch (error) {
    console.log("mongoDb is disConnected");
    console.log("db Eroor:", error);
  }
};

export default connectDB;
