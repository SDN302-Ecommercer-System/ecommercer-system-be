import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const {
      items,
      totalPrice,
      discount,
      finalPrice,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      orderStatus,
    } = req.body;

    const formattedItems = items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price,
      size: item.size,
      color: item.color._id,
    }));

    const newOrder = new Order({
      user: req.body.userId,
      items: formattedItems,
      totalPrice,
      discount,
      finalPrice,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      orderStatus,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("items.product")
      .populate("items.color");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Lấy tất cả Orders
export const getAllOrdersOfUser = async (req, res) => {
  try {
    const {userId} = req.body;
    const orders = await Order.find({user: userId})
      .populate("user")
      .populate("items.product")
      .populate("items.color");
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết Order
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("items.product")
      .populate("items.color");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật trạng thái Order
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = status;
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
