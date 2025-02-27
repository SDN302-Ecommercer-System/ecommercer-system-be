import ApiResponse from "../dto/ApiResponseCustom.js";
import JwtUtils from "../helper/auth.helper.js";
import Role from "../models/Role.js";
import User from "../models/User.js";
import * as userService from "../services/user.service.js";

export const getHello = (req, res) => {
  const responseData = userService.getHello(req, res);
  res.send(new ApiResponse(200, "Name was custom test CD", responseData, true));
};

export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone }).populate({
      path: "role",
      select: "name",
    });

    if (!user) {
      res.send(new ApiResponse(404, "unauthorize", null));
      return;
    }

    const isMatch = JwtUtils.comparePassword(password, user.password);

    if (!isMatch) {
      res.send(new ApiResponse(404, "wrong password", null));
      return;
    }

    //jwt token generate
    const token = JwtUtils.signJwt({phone: user.phone});

    res.send(new ApiResponse(200, "login successfully", token));

  } catch (error) {
    res.send(new ApiResponse(500, "internal error", error));
  }
};

export const register = async (req, res) => {
  try {
    const { phone, password, role } = req.body;

    const hashedPassword = await JwtUtils.hashPassword(password);
    
    const newUser = new User({password: hashedPassword, phone, role: role || 'user'});

    //save
    await newUser.save();

    res.send(
      new ApiResponse(200, "register success", newUser)
    );
  } catch (error) {
    res.send(new ApiResponse(500, "internal error", error.message));
  }
};

export const protectedRoute = (req, res) => {
   res.send(new ApiResponse(200, 'welcome protected', null));
}

