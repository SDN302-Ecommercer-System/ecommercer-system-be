import mongoose from "mongoose";

const productColorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Color name must be required"],
    },
    hexCode: {
      type: String,
      required: [true, "Hex code must be required"],
    },
    images: [
      {
        url: {
          type: String,
          required: [true, "Image of color must be required"],
        },
      },
    ],
  },
  { timestamps: true }
);

const ProductColor = mongoose.model("ProductColor", productColorSchema);

export default ProductColor;
