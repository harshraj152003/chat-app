import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { getMessage, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

// Get all users except the logged in user
messageRouter.get("/users", userAuth, getUsersForSidebar);

// Get all messages for selected user
messageRouter.get("/:id", userAuth, getMessage);

// api to mark message as seen using message id
messageRouter.put("mark/:id", userAuth, markMessageAsSeen);

// send message to selected user
messageRouter.post("/send/:id", userAuth, sendMessage);

export default messageRouter;
