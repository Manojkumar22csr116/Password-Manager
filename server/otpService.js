import nodemailer from "nodemailer";
import crypto from "crypto";
import "dotenv/config";

const otpStore = new Map();

export const sendOtp = async (user) => {
  const { email, username } = user;
  const otp = crypto.randomInt(100000, 999999).toString();

  otpStore.set(username, otp);

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "OTP sent successfully." };
  } catch (error) {
    return { success: false, error };
  }
};

export function verifyOtp(username, inputOtp) {
  const storedOtp = otpStore.get(username);

  if (!storedOtp) {
    return {
      error: "OTP not found. Please request a new one.",
    };
  }

  if (storedOtp === inputOtp) {
    otpStore.delete(username);
    return { success: true, message: "OTP verified successfully." };
  } else {
    return { success: false, error: "Invalid OTP." };
  }
}
