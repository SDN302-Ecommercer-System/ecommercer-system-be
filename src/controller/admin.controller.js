import ApiResponse from "../dto/ApiResponseCustom.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

/**
 * Product Analytics Controllers
 */
const getProductStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $unwind: "$sizes"
      },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalQuantity: { $sum: "$sizes.quantity" },
          totalCategories: { $addToSet: "$category" },
          averagePrice: { $avg: "$price" },
          totalDiscountedProducts: {
            $sum: { $cond: [{ $gt: ["$discount", 0] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalProducts: 1,
          totalQuantity: 1,
          categoryCount: { $size: "$totalCategories" },
          averagePrice: { $round: ["$averagePrice", 2] },
          totalDiscountedProducts: 1
        }
      }
    ]);

    res.status(200).send(new ApiResponse(200, "Product stats retrieved", stats[0], true));
  } catch (error) {
    res.status(500).send(new ApiResponse(500, "Error getting product stats", error.message, false));
  }
};

const getLowStockProducts = async (req, res) => {
  try {
    const lowStockProducts = await Product.aggregate([
      { $unwind: "$sizes" },
      {
        $match: {
          "sizes.quantity": { $gt: 0, $lt: 10 }
        }
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          category: { $first: "$category" },
          lowStockSizes: {
            $push: {
              size: "$sizes.size",
              quantity: "$sizes.quantity"
            }
          }
        }
      },
      {
        $lookup: {
          from: "productcolors",
          localField: "colors",
          foreignField: "_id",
          as: "colorDetails"
        }
      },
      { $sort: { "lowStockSizes.quantity": 1 } }
    ]);

    res.status(200).send(new ApiResponse(200, "Low stock products retrieved", lowStockProducts, true));
  } catch (error) {
    res.status(500).send(new ApiResponse(500, "Error getting low stock products", error.message, false));
  }
};

const getBestSellingProducts = async (req, res) => {
  try {
    const bestSellers = await Order.aggregate([
      { $match: { orderStatus: { $ne: "cancelled" } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalQuantitySold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          sizeBreakdown: {
            $push: {
              size: "$items.size",
              quantity: "$items.quantity"
            }
          }
        }
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          "productDetails.name": 1,
          "productDetails.category": 1,
          "productDetails.price": 1,
          totalQuantitySold: 1,
          totalRevenue: 1,
          sizeBreakdown: 1
        }
      }
    ]);

    res.status(200).send(new ApiResponse(200, "Best selling products retrieved", bestSellers, true));
  } catch (error) {
    res.status(500).send(new ApiResponse(500, "Error getting best selling products", error.message, false));
  }
};

/**
 * Order Analytics Controllers
 */
const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$finalPrice" },
          averageOrderValue: { $avg: "$finalPrice" },
          paymentPending: {
            $sum: { $cond: [{ $eq: ["$paymentStatus", "pending"] }, 1, 0] }
          },
          paymentCompleted: {
            $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          status: "$_id",
          count: 1,
          totalRevenue: { $round: ["$totalRevenue", 2] },
          averageOrderValue: { $round: ["$averageOrderValue", 2] },
          paymentPending: 1,
          paymentCompleted: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).send(new ApiResponse(200, "Order stats retrieved", stats, true));
  } catch (error) {
    res.status(500).send(new ApiResponse(500, "Error getting order stats", error.message, false));
  }
};

const getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'email')
      .populate({
        path: 'items.product',
        select: 'name category price'
      })
      .populate({
        path: 'items.color',
        select: 'name hexCode'
      })
      .select('-__v');

    res.status(200).send(new ApiResponse(200, "Recent orders retrieved", recentOrders, true));
  } catch (error) {
    res.status(500).send(new ApiResponse(500, "Error getting recent orders", error.message, false));
  }
};

const getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    // Validate status
    const validStatuses = ["processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).send(
        new ApiResponse(400, "Invalid order status", null, false)
      );
    }

    const orders = await Order.find({ orderStatus: status })
      .sort({ createdAt: -1 })
      .populate('user', 'email')
      .populate({
        path: 'items.product',
        select: 'name category price'
      })
      .populate({
        path: 'items.color',
        select: 'name hexCode'
      })
      .select('-__v');

    res.status(200).send(new ApiResponse(200, `${status} orders retrieved`, orders, true));
  } catch (error) {
    res.status(500).send(new ApiResponse(500, "Error getting orders by status", error.message, false));
  }
};

export {
  getProductStats,
  getLowStockProducts,
  getBestSellingProducts,
  getOrderStats,
  getRecentOrders,
  getOrdersByStatus
};
