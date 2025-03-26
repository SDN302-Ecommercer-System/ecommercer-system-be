import express from "express";
import { verifyRole, verifyToken } from "../middleware/auth.middleware.js";
import { ADMIN_ROLE } from "../helper/constant/MyConstant.js";
import {
  getBestSellingProducts,
  getLowStockProducts,
  getOrdersByStatus,
  getOrderStats,
  getProductStats,
  getRecentOrders,
} from "../controller/admin.controller.js";

const adminRouter = express.Router();

/**
 * Product Analytics Routes
 */
adminRouter.get(
  "/products/stats",
  verifyToken,
  verifyRole(ADMIN_ROLE),
  getProductStats
);
adminRouter.get(
  "/products/low-stock",
  verifyToken,
  verifyRole(ADMIN_ROLE),
  getLowStockProducts
);
adminRouter.get(
  "/products/best-selling",
  verifyToken,
  verifyRole(ADMIN_ROLE),
  getBestSellingProducts
);

/**
 * Order Analytics Routes
 */
adminRouter.get("/orders/stats", verifyToken, verifyRole(ADMIN_ROLE), getOrderStats);
adminRouter.get(
  "/orders/recent",
  verifyToken,
  verifyRole(ADMIN_ROLE),
  getRecentOrders
);
adminRouter.get(
  "/orders/by-status/:status",
  verifyToken,
  verifyRole(ADMIN_ROLE),
  getOrdersByStatus
);

export default adminRouter;
