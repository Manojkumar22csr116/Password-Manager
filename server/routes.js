import express from "express";
import bcrypt from "bcrypt";
import { Password, User } from "./db.js";
import { authenticateToken } from "./middleware.js";
import { generatePassword } from "./utils.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { sendOtp, verifyOtp } from "./otpService.js";

const { JWT_SECRET } = process.env;
export const router = express.Router();

router.post("/user/signup", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "User registration failed. Username or email might already exist.",
    });
  }
});

router.post("/user/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Username doesn't exist" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid username or password" });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ token, username: user.username });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

router.put("/user/password", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { username },
      { password: hashedPassword },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

router.post("/verify-login", authenticateToken, async (req, res) => {
  const { password } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.status(200).json({ verified: true });
    } else {
      res.status(401).json({ verified: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

router.get("/passwords", authenticateToken, async (req, res) => {
  try {
    const passwords = await Password.find({ userId: req.userId });
    res.status(200).json(passwords);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

router.post("/passwords", authenticateToken, async (req, res) => {
  const { website, password } = req.body;

  try {
    const newPassword = new Password({
      website,
      password,
      userId: req.userId,
    });
    await newPassword.save();
    res.status(200).json({ message: "Password saved successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "This website and it's corresponding password already exists",
    });
  }
});

router.put("/passwords/:id", authenticateToken, async (req, res) => {
  const { loginPassword } = req.body;

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(loginPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Incorrect login password" });
  }

  const newPassword = generatePassword();
  await Password.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { password: newPassword }
  );
  res.json({
    message: "Password regenerated successfully",
  });
});

router.delete("/passwords/:id", authenticateToken, async (req, res) => {
  try {
    await Password.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    res.json({ message: "Password deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

router.post("/send-otp", async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Username" });
    }
    const result = await sendOtp(user);
    if (result.error) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.post("/verify-otp", (req, res) => {
  try {
    const { username, otp } = req.body;

    if (!username || !otp) {
      return res
        .status(400)
        .json({ success: false, error: "Email and OTP are required" });
    }

    const result = verifyOtp(username, otp);
    if (result.error) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
