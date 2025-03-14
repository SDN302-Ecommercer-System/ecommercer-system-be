import { Router } from "express";
import * as orderController from "../controller/order.controller.js";
import * as authMiddleWare from "../middleware/auth.middleware.js";
import * as CONSTANT from "../helper/constant/MyConstant.js";

const orderRouter = Router();

orderRouter.post("/", authMiddleWare.verifyToken, orderController.createOrder);
orderRouter.get("/", authMiddleWare.verifyToken, orderController.getAllOrders);
orderRouter.put(
  "/:id",
  authMiddleWare.verifyToken,
  orderController.updateOrderStatus
);
orderRouter.get(
  "/:id",
  authMiddleWare.verifyToken,
  orderController.getOrderById
);

export default orderRouter;
