import { Router } from "express";
import * as productController from "../controller/product.controller.js";
import * as authMiddleWare from "../middleware/auth.middleware.js";
import * as CONSTANT from "../helper/constant/MyConstant.js";

const productRouter = Router();

// Public routes (no auth required)
productRouter.get("/", productController.getAllProduct);
productRouter.get("/:id", productController.getProductById);

// Admin only routes
productRouter.post(
  "/",
  authMiddleWare.verifyToken,
  authMiddleWare.verifyRole(CONSTANT.ADMIN_ROLE),
  productController.addProduct
);

productRouter.put(
  "/:id",
  authMiddleWare.verifyToken,
  authMiddleWare.verifyRole(CONSTANT.ADMIN_ROLE),
  productController.updateProduct
);

productRouter.delete(
  "/:id",
  authMiddleWare.verifyToken,
  authMiddleWare.verifyRole(CONSTANT.ADMIN_ROLE),
  productController.deleteProduct
);

export default productRouter;
