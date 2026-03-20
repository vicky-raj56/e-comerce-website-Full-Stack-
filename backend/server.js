import "dotenv/config";
import app from "./src/app.js";
import http from "http";
import connectDB from "./src/configs/db.js";
import { connectCloudinary } from "./src/configs/cloudinary.js";
import connectRedis from "./src/redis/redisClient.js";

// database connected
const server = http.createServer(app);
connectCloudinary();

const PORT = process.env.PORT || 5000;
(async function serverStarted() {
  try {
    await connectDB();
    await connectCloudinary();
    await connectRedis()
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("server file error:", error);
  }
})();

// IIFI call
