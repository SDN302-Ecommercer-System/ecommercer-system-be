import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name of product required"],
    },
    colors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductColor",
      },
    ],
    sizes: [
      {
        size: { type: String, enum: ["S", "M", "L", "XL"] },
        quantity: Number,
      },
    ],
    price: { type: Number, required: true },
    description: {
      type: String,
      required: [true, "Description must be required"],
    },
    category: {
      type: String,
      enum: {
        values: ["male", "female"],
        message: "Category must be either 'male' or 'female'",
      },
      trim: true,
      required: [true, "Category is required"],
    },
    discount: {
      type: Number,
      validate: {
        validator: function (value) {
          return value >= 0 && value <= 100; 
        },
        message: "Invalid discount! Discount must be between 0 and 100.",
      },
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
