import validator from "validator";
import User from "../models/user.js";

// Validate Sign Up data
export const validateSignUpData = async (req) => {
  const { fullName, email, password, bio } = req.body;

  if (!fullName) {
    throw new Error("Full name is required.");
  }

  if (!email) throw new Error("Email address is required.");

  if (!password) throw new Error("Password is required.");

  if (!validator.isEmail(email.trim())) {
    throw new Error("The provided email address is not valid.");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol."
    );
  }

  if (!bio) {
    throw new Error("Must write bio.");
  }

  return true;
};

// Validate login data
export const validateLoginData = (req) => {
  const { email, password } = req.body;

  if (!email || validator.isEmpty(email.trim())) {
    throw new Error("Email address is required.");
  }

  if (!password) {
    throw new Error("Password is required.");
  }

  if (!validator.isEmail(email.trim())) {
    throw new Error("Invalid email format.");
  }

  return true;
};
