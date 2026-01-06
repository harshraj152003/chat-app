import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.put("/update-profile", userAuth, updateProfile);
userRouter.get("/check", userAuth, checkAuth);

export default userRouter;