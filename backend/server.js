import "dotenv/config";
import app from "./src/app.js";
import http from "http";
import connectDB from "./src/configs/db.js";

// database connected
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
(async function serverStarted() {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("serevr file error:", error);
  }
})();

// IIFI call
