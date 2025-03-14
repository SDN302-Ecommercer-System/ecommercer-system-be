import ApiResponse from "../dto/ApiResponseCustom.js";
import JwtUtils from "../helper/auth.helper.js";
import * as CONSTANT from "../helper/constant/MyConstant.js";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(CONSTANT.SPLIT_PREFIX)[1];

  const { valid, data } = JwtUtils.verifyJwt(token);

  if (!valid) {
    res.status(401).send(new ApiResponse(401, "Token expired or invalid token", null));
    return;
  }

  const email = data.email;
  const userFound = await User.findOne({ email });

  if (!userFound) {
    res.send(new ApiResponse(401, "Your account is not available", null));
    return;
  }

  req.body.userId = userFound._id;
  next();
};

export const verifyRole = (requiredRole) => {
  return async (req, res, next) => {
    const { userId } = req.body;

    const userFound = await User.findOne({ _id: userId });


    if (userFound.role !== requiredRole) {
      return res.send(new ApiResponse(403, "You don't have permission", null));
    }
    next();
  };
};
