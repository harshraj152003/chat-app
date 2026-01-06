import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type:String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
        minlenght: 8,
    },
    profilePic: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
    },
}, { timestamps:true })

// validate password using bcrypt
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const passwordHash = this.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

const User = mongoose.model('User', userSchema);

export default User;