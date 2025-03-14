import { Router } from "express";
import * as productController from "../controller/product.controller.js";
import * as authMiddleWare from "../middleware/auth.middleware.js";
import * as CONSTANT from "../helper/constant/MyConstant.js";

const productRouter = Router();

productRouter.post(
  "/",
  authMiddleWare.verifyToken,
  authMiddleWare.verifyRole(CONSTANT.USER_ROLE),
  productController.addProduct
);
productRouter.get(
  "/",
  productController.getAllProduct
);
productRouter.get(
  "/:id",
  productController.getProductById
);

export default productRouter;
