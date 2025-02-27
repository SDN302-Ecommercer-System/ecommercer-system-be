import { Router } from "express";
import * as userController from "../controller/user.controller.js"
import * as userMiddleWare from "../middleware/user.middleware.js"
import * as authMiddleWare from "../middleware/auth.middleware.js"
import * as CONSTANT from "../helper/constant/MyConstant.js"

const userRoute = Router();

userRoute.get('/',userMiddleWare.verifyName, userController.getHello);
userRoute.post('/login', userController.login);
userRoute.post('/register', userController.register);
userRoute.get(
    '/protected',
    authMiddleWare.verifyToken, 
    authMiddleWare.verifyRole(CONSTANT.USER_ROLE), 
    userController.protectedRoute
);


export default userRoute;

