import nodemailer from "nodemailer";
import User from "../models/User.js";
import JwtUtils from "../helper/auth.helper.js";
import * as CONSTANT from "../helper/constant/MyConstant.js";
import ApiResponse from "../dto/ApiResponseCustom.js";

const sendEmail = async (req, res) => {
  const { to, password } = req.body;

  if (!to || !password) {
    return res.status(400).send({ message: "Email is required" });
  }

  // Generate 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000);

  // Configure Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email template
  const mailOptions = {
    from: `"SDN302 - Group 1" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify OTP Code",
    html: `
      <div style="max-width: 500px; margin: auto; padding: 20px; font-family: Arial, sans-serif; text-align: center; background: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2>🔐 Verify Your OTP Code</h2>
        <p>Dear user,</p>
        <p>Your One-Time Password (OTP) is:</p>
        <p style="font-size: 24px; font-weight: bold; color: #e74c3c; margin: 20px 0;">${otp}</p>
        <p>This OTP is valid for <b>10 minutes</b>. Please do not share it with anyone.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p style="font-size: 12px; color: #777; margin-top: 20px;">Thank you,<br>Your Company Name</p>
      </div>
    `,
  };

  try {
    // Find and update user OTP

    const user = await User.findOne({ email: to });

    if (user) {
      // Send OTP via email
      const isMatch = await JwtUtils.comparePassword(
        password,
        user?.password || ""
      );
      if (!isMatch) {
        return res.status(401).send({
          message: "User not found or password invalid",
          success: false,
          status: 401,
        });
      }

      await transporter.sendMail(mailOptions);
      await User.updateOne({ email: to }, { $set: { otpVerify: otp } });
    } else {
      return res.status(404).send({
        message: "User not found or password invalid",
        success: false,
        status: 404,
      });
    }

    res
      .status(200)
      .send({ message: "OTP sent successfully", success: true, status: 200 });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).send({
      message: "Failed to send OTP",
      error: error.message,
      success: false,
      status: 500,
    });
  }
};

const verifyToken = (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(CONSTANT.SPLIT_PREFIX)[1];

  const { valid } = JwtUtils.verifyJwt(token);

  if (!valid) {
    return res
      .status(401)
      .send(new ApiResponse(401, "Token expired or invalid token", null));
  }
  return res.status(200).send(new ApiResponse(200, "Token verified", null));
};

export { sendEmail, verifyToken };
