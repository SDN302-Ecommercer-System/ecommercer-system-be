import { Router } from "express";
import * as userController from "../controller/user.controller.js";
import * as userMiddleWare from "../middleware/user.middleware.js";
import * as authMiddleWare from "../middleware/auth.middleware.js";
import * as CONSTANT from "../helper/constant/MyConstant.js";

const userRoute = Router();

userRoute.get("/", userMiddleWare.verifyName, userController.getHello);
userRoute.post("/login", userController.login);
userRoute.post(
  "/change-password",
  authMiddleWare.verifyToken,
  userController.changePassword
);
userRoute.post("/register", userController.register);

userRoute.put(
  "/update-profile",
  authMiddleWare.verifyToken,
  userController.updateProfile
);

userRoute.get(
  "/protected",
  authMiddleWare.verifyToken,
  authMiddleWare.verifyRole(CONSTANT.USER_ROLE),
  userController.protectedRoute
);

userRoute.get(
  "/detail",
  authMiddleWare.verifyToken,
  authMiddleWare.verifyRole(CONSTANT.USER_ROLE),
  userController.getUser
);

userRoute.get(
  "/list",
  authMiddleWare.verifyToken,
  authMiddleWare.verifyRole(CONSTANT.ADMIN_ROLE),
  userController.getAllUser
);

export default userRoute;
