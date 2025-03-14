import ApiResponse from "../dto/ApiResponseCustom.js";
import JwtUtils from "../helper/auth.helper.js";
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

    const user = await User.findOne({email})

    //jwt token generate
    const token = JwtUtils.signJwt({ email: email });

    res.send(new ApiResponse(200, "login successfully", {
      token,
      userInformation: {
        email: user.email,
        avatar: user.avatar || null
      }
    }));
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
      isActive: true
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

    const isMatchOtp = userFound.otpVerify === otp;
        
    return isMatchOtp;
    
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getUser = (req, res) => {
  try {
    const {user} = req.user;

    return res.status(200).send({
      message: 'user information',
      data: user,
      success: true
    })
  } catch(error){
    return res.status(500).send({
      message: 'server error',
      data: null,
      success: false
    })
  }
}

export const protectedRoute = (req, res) => {
  res.send(new ApiResponse(200, "welcome protected", null));
};
