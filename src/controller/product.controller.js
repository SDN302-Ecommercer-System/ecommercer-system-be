import ApiResponse from "../dto/ApiResponseCustom.js";
import Product from "../models/Product.js";
import ProductColor from "../models/ProductColor.js";

const addProduct = async (req, res) => {
  try {
    const { name, sizes, price, description, category, colorWithImage, discount } =
      req.body;

    const colors = await saveColors(colorWithImage);

    const product = new Product({
      name,
      price,
      sizes,
      description,
      category,
      colors,
      discount
    });

    await product.save();
    res
      .status(201)
      .send(new ApiResponse(201, "Create product success", product, true));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send(new ApiResponse(500, "Error from server", error.message, false));
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate("colors");

    if (!product) {
      return res
        .status(404)
        .send(new ApiResponse(404, "Product not found", null, false));
    }

    res
      .status(200)
      .send(new ApiResponse(200, "Get product success", product, true));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send(new ApiResponse(500, "Error from server", error.message, false));
  }
};

const getAllProduct = async (req, res) => {
    try {
      const product = await Product.find({}).populate('colors');
  
      res
        .status(200)
        .send(new ApiResponse(200, "Get product success", product, true));
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send(new ApiResponse(500, "Error from server", error.message, false));
    }
  };

/**
 * 
 * UTILS FUNCTION FOR CONTROLLER
 * 
 * 
 */


/**
 * 
 * @param {*} colorWithImage list of color model
 * @returns 
 */
const saveColors = async (colorWithImage) => {
  if (!Array.isArray(colorWithImage) || colorWithImage.length === 0) return [];

  const colorsToInsert = colorWithImage.map(
    ({ hexCode, nameOfColor, images }) => ({
      hexCode,
      name: nameOfColor,
      images,
    })
  );

  const savedColors = await ProductColor.insertMany(colorsToInsert);

  return savedColors.map((color) => color._id);
};


/**
 * Exporting
 */
export { addProduct, getProductById, getAllProduct };
