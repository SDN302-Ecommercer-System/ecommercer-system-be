import { Router } from "express";
import * as orderController from "../controller/order.controller.js";
import * as authMiddleWare from "../middleware/auth.middleware.js";
import * as CONSTANT from "../helper/constant/MyConstant.js";

const orderRouter = Router();

orderRouter.post("/", authMiddleWare.verifyToken, orderController.createOrder);
orderRouter.get("/", orderController.getAllOrders);
orderRouter.get("/list", authMiddleWare.verifyToken, orderController.getAllOrdersOfUser);

orderRouter.put(
  "/:id",
  orderController.updateOrderStatus
);
orderRouter.get(
  "/:id",
  authMiddleWare.verifyToken,
  orderController.getOrderById
);

export default orderRouter;
