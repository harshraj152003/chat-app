import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    // Validate the token
    const decodedObj = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(
      decodedObj.userId || decodedObj._id
    ).select("-password");

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Auth Error:", err.message);
    res.status(401).json({
      success: false,
      message: "Authentication failed: " + err.message,
    });
  }
};
