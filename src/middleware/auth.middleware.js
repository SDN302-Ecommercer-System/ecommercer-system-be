import ApiResponse from "../dto/ApiResponseCustom.js";
import JwtUtils from "../helper/auth.helper.js";
import * as CONSTANT from "../helper/constant/MyConstant.js";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(CONSTANT.SPLIT_PREFIX)[1];

  const { valid, data } = JwtUtils.verifyJwt(token);

  if (!valid) {
    res.send(new ApiResponse(401, "Token expired or invalid token", null));
    return;
  }

  const phone = data.phone;
  const userFound = await User.findOne({ phone });

  if (!userFound) {
    res.send(new ApiResponse(401, "Your account is not available", null));
    return;
  }

  req.user = userFound;
  next();
};

export const verifyRole = (requiredRole) => {
    return (req, res, next) => {
      const { user } = req;
  
      if (user.role !== requiredRole) {
        return res.send(new ApiResponse(403, "You don't have permission", null));
      }
      next();
    };
  };