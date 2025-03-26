import ApiResponse from "../dto/ApiResponseCustom.js";
import JwtUtils from "../helper/auth.helper.js";
import { ADMIN_ROLE } from "../helper/constant/MyConstant.js";
import User from "../models/User.js";

export const getHello = (req, res) => {
  const responseData = userService.getHello(req, res);
  res.send(new ApiResponse(200, "Name was custom test CD", responseData, true));
};

export const login = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).send(new ApiResponse(400, "information invalid", null));
      return;
    }

    const isMatchOtp = await verifyOtp(otp, email);

    if (!isMatchOtp) {
      return res.status(401).send(new ApiResponse(401, "unauthorize", null));
    }

    const user = await User.findOne({ email });

    //jwt token generate
    const token = JwtUtils.signJwt({ email: email });

    res.send(
      new ApiResponse(200, "login successfully", {
        token,
        userInformation: {
          email: user.email,
          avatar: user.avatar || null,
        },
      })
    );
  } catch (error) {
    res.send(new ApiResponse(500, "internal error", error));
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const userFound = await User.findOne({ email });

    if (userFound) {
      return res.send(new ApiResponse(400, "this email has existed", null));
    }

    const hashedPassword = await JwtUtils.hashPassword(password);

    const newUser = new User({
      password: hashedPassword,
      email,
      role: role || "user",
      isActive: true,
      phone: null,
      address: null,
    });

    //save
    await newUser.save();

    res.status(200).send(new ApiResponse(200, "register success", newUser));
  } catch (error) {
    res.status(500).send(new ApiResponse(500, "internal error", error.message));
  }
};

const verifyOtp = async (otp, email) => {
  try {
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return false;
    }

    const isMatchOtp = userFound.otpVerify === otp;

    return isMatchOtp;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId, user: userUpdateInformation } = req.body;

    const userFound = await User.findById(userId);

    userFound.phone = userUpdateInformation.phone;
    userFound.address = userUpdateInformation.address;

    await userFound.save();

    return res.status(200).json({
      message: "Updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      message: "server error",
      data: null,
      success: false,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const userFound = await User.findById(userId).select("-password -role");

    if (!userFound) {
      return res.status(400).send({
        message: "user not found",
        data: null,
        success: false,
      });
    }

    return res.status(200).send({
      message: "user information",
      data: userFound,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "server error",
      data: null,
      success: false,
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const usersFound = await User.find({
      role: { $ne: ADMIN_ROLE },
    }).select("-password");

    return res.status(200).send({
      message: "user information",
      data: usersFound,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "server error",
      data: null,
      success: false,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userId } = req.body;
    const { oldPassword, newPassword } = req.body;

    // Kiểm tra đầu vào
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Both old and new passwords are required",
        success: false,
      });
    }

    // Tìm người dùng
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Xác minh mật khẩu cũ
    const isMatch = await JwtUtils.comparePassword(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Old password is incorrect",
        success: false,
      });
    }

    // Mã hóa mật khẩu mới và cập nhật
    const hashedPassword = await JwtUtils.hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const protectedRoute = (req, res) => {
  res.send(new ApiResponse(200, "welcome protected", null));
};
