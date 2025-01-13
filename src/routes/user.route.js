import { Router } from "express";
import * as userController from "../controller/user.controller.js"
import * as userMiddleWare from "../middleware/user.middleware.js"

const userRoute = Router();

userRoute.get('/',userMiddleWare.verifyName, userController.getHello);

export default userRoute;

