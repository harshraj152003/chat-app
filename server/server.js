import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./config/database.js";
import userRouter from "./routes/user.js";
import messageRouter from "./routes/message.js";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

const PORT_NO = process.env.PORT_NO || 5000;

const app = express();
const server = http.createServer(app);

// Initialize socket.io server
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Store online users
export const userSocketMap = {}; //{ userId: socketId }

// socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected ", userId);

  if (userId) userSocketMap[userId] = socket.id;

  // Emit online users to all connected client
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected ", userId);
    if (userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware setup
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "4mb" }));
app.use(cookieParser());

// Routes setup
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

connectDB()
  .then(() => {
    server.listen(PORT_NO, () => {
      console.log(`Server is listening on localhost:${PORT_NO}`);
    });
  })
  .catch((err) => {
    console.log("Database not connected");
  });
