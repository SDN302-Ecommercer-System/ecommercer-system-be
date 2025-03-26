import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import ProductColor from "../models/ProductColor.js";

const add = async (req, res) => {
  try {
    const { quantity, productId, price, size, colorId, userId } = req.body;

    const productFound = await Product.findById(productId);

    const colorFound = await ProductColor.findById(colorId);

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Nếu chưa có giỏ hàng, tạo mới
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color.toString() === colorId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = price;
    } else {
      // Nếu chưa có, thêm mới vào giỏ hàng
      cart.items.push({
        product: productId,
        quantity,
        price,
        size,
        color: colorId,
      });
    }

    // Tính lại tổng giá
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    // Populate dữ liệu sản phẩm và màu sắc trước khi trả về
    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: "items.product",
        select: "name images price",
      })
      .populate({
        path: "items.color",
        select: "hexCode images",
      });

    res.status(200).send({
      message: "Add to cart success",
      success: true,
      cart: populatedCart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
};

const getCart = async (req, res) => {
  try {
    const { userId } = req.body;

    // Tìm giỏ hàng của user và populate dữ liệu
    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: "items.product",
        select: "name images price",
      })
      .populate({
        path: "items.color",
        select: "hexCode images",
      });

    if (!cart) {
      return res.status(404).send({
        success: false,
        message: "Cart not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Cart retrieved successfully",
      cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { id } = req.params; // id của sản phẩm trong items
    const { quantity, userId } = req.body;

    // Tìm giỏ hàng của user
    const cart = await Cart.findOne({ user: userId }).populate({
        path: "items.product",
        select: "name images price",
      })
      .populate({
        path: "items.color",
        select: "hexCode images",
      });

    if (!cart) {
      return res.status(404).send({
        success: false,
        message: "Cart not found",
      });
    }

    // Tìm sản phẩm trong giỏ hàng
    const item = cart.items.find((item) => item._id.toString() === id);
    if (!item) {
      return res.status(404).send({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Cập nhật số lượng và tổng giá
    item.quantity = quantity;
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).send({
      success: true,
      message: "Quantity updated successfully",
      cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const removeItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Tìm giỏ hàng của user
    const cart = await Cart.findOne({ user: userId }).populate({
        path: "items.product",
        select: "name images price",
      })
      .populate({
        path: "items.color",
        select: "hexCode images",
      });

    if (!cart) {
      return res.status(404).send({
        success: false,
        message: "Cart not found",
      });
    }

    // Lọc để xoá sản phẩm
    cart.items = cart.items.filter((item) => item._id.toString() !== id);

    // Cập nhật lại tổng giá
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).send({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

export { add, getCart, updateQuantity, removeItem };
