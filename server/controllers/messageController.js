import cloudinary from "../lib/cloudinary.js";
import Message from "../models/messages.js";
import User from "../models/user.js";
import { userSocketMap, io } from "../lib/socket.js";

// Get all users except the logged in user
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    // Count number of unseen messages
    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        recieverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });
    await Promise.all(promises);
    res.json({
      success: true,
      user: filteredUsers,
      unseenMessages,
    });
  } catch (err) {
    console.log("Error: " + err.message);
    res.status(404).json({
      success: false,
      message: "Error in fetching users : " + err.message,
    });
  }
};

// Get all messages for selected user
export const getMessage = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const loggedInUserId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, recieverId: selectedUserId },
        { senderId: selectedUserId, recieverId: loggedInUserId },
      ],
    });

    await Message.updateMany(
      { senderId: selectedUserId, recieverId: loggedInUserId },
      { seen: true }
    );

    res.json({
      success: true,
      data: messages,
    });
  } catch (err) {
    console.log("Error: " + err.message);
    res.status(404).json({
      success: false,
      message: "Error: " + err.message,
    });
  }
};

// api to mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });

    res.json({
      success: true,
    });
  } catch (err) {
    console.log("Error: " + err.message);
    res.status(404).json({
      success: false,
      message: "Error: " + err.message,
    });
  }
};

// send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const recieverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      recieverId,
      text,
      image: imageUrl,
    });

    // Emit the new message to the reciever's socket
    const recieverSocketId = userSocketMap[recieverId];

    if (recieverSocketId) {
      io.to(recieverSocketId).emit("newMessage", newMessage);
    }

    res.json({
      success: true,
      message: newMessage,
    });
  } catch (err) {
    console.log("Error: " + err.message);
    res.status(404).json({
      success: false,
      message: "Error: " + err.message,
    });
  }
};
