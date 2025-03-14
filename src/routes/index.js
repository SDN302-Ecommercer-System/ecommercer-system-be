import { Router } from "express";
import userRoute from "./user.route.js";
import productRouter from "./product.route.js";
import * as verifyController from "../controller/verify.controller.js"
import cartRouter from "./cart.route.js";
import orderRouter from "./order.route.js";

const mainRoute = Router();

mainRoute.use("/user", userRoute);
mainRoute.use("/product", productRouter);
mainRoute.use("/cart", cartRouter);
mainRoute.use("/order", orderRouter);
mainRoute.post("/verify_otp", verifyController.sendEmail);
mainRoute.post("/verify_token", verifyController.verifyToken);


export default mainRoute;