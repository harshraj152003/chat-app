import "dotenv/config";
import cors from "cors";
import { connectDB } from "./config/database.js";
import userRouter from "./routes/user.js";
import messageRouter from "./routes/message.js";
import cookieParser from "cookie-parser";
import express from "express";

import { app, server } from "./lib/socket.js";

const PORT_NO = process.env.PORT_NO || 5000;

// Middleware setup
app.use(
  cors({
    origin: "https://chat-app-nu-ruby-80.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options(
  "*",
  cors({
    origin: "https://chat-app-nu-ruby-80.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "4mb" }));
app.use(cookieParser());

// Routes setup
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Start Server
connectDB()
  .then(() => {
    if (process.env.NODE_ENV !== "production") {
      server.listen(PORT_NO, () => {
        console.log(`Server is listening on localhost:${PORT_NO}`);
      });
    }
  })
  .catch((err) => {
    console.log("Database connection failed", err);
  });

// Export server for vercel
export default server;
