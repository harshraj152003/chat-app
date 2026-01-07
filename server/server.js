import "dotenv/config";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/database.js";
import userRouter from "./routes/user.js";
import messageRouter from "./routes/message.js";

const PORT_NO = process.env.PORT_NO || 5000;

import { app, server, allowedOrigins } from "./lib/socket.js";

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(express.json({ limit: "4mb" }));
app.use(cookieParser());

app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

connectDB()
  .then(() => {
    console.log("Database connection established..");
    if (process.env.NODE_ENV !== "production") {
      server.listen(PORT_NO, () => {
        console.log(`Server running on port ${PORT_NO}`);
      });
    }
  })
  .catch((err) =>
    console.log("Database not connected! --> Error: " + err.message)
  );

export default server;
