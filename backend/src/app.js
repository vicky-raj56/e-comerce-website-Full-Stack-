import express from "express";
const app = express();

import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";

// middleware use;
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));
app.use(cors());
app.use(cookieParser());

//  All routes middlewre

app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => {
  res.send("hello");
});
export default app;
