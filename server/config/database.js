import mongoose from "mongoose";
import "dotenv/config";

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database connection Established")
    );
    const db = await mongoose.connect(process.env.MONGODB_URI);
  } catch (err) {
    console.log("Error: " + err.message);
  }
};
