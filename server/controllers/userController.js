import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { validateLoginData, validateSignUpData } from "../utils/validation.js";
import { generateToken } from "../utils/tokenGenerator.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  await validateSignUpData(req);
  const { fullName, email, password, bio } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: "Account created successfully",
      data: userResponse,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    validateLoginData(req); 

    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.json({
      success: true,
      message: "Login successful",
      userData: userResponse,
    });

  } catch (err) {
    console.error("Login Error:", err.message);
    return res.json({
      success: false,
      message: err.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// controller to check if user is authencticated
export const checkAuth = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;

    const userId = req.user._id;
    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);

      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    }
    res.json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({
      success: false,
      message: "Error: " + err.message,
    });
  }
};
