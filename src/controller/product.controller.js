import ApiResponse from "../dto/ApiResponseCustom.js";
import Product from "../models/Product.js";
import ProductColor from "../models/ProductColor.js";

const addProduct = async (req, res) => {
  try {
    const {
      name,
      sizes,
      price,
      description,
      category,
      colorWithImage,
      discount,
    } = req.body;

    const colors = await saveColors(colorWithImage);

    const product = new Product({
      name,
      price,
      sizes,
      description,
      category,
      colors,
      discount,
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
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 12);
    const category = req.query.category || "";
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    //query
    const query = {};

    // Add category filter if provided
    if (category) query.category = category;

    // Add search filter if provided
    if (search) {
      query.name = { 
        $regex: search, 
        $options: 'i'  // case-insensitive search
      };
    }

    const totalProducts = await Product.countDocuments(query);

    const product = await Product.find(query)
      .populate("colors")
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalProducts / limit);

    const pagination = {
      currentPage: page,
      totalPages,
      totalProducts,
    };

    res
      .status(200)
      .send(
        new ApiResponse(200, "Get product success", product, true, pagination)
      );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send(new ApiResponse(500, "Error from server", error.message, false));
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      sizes,
      price,
      description,
      category,
      colorWithImage, // Array of color updates
      discount,
    } = req.body;

    // Find the product first
    const product = await Product.findById(id).populate("colors");
    if (!product) {
      return res
        .status(404)
        .send(new ApiResponse(404, "Product not found", null, false));
    }

    // Handle color updates
    let updatedColorIds = [];

    if (colorWithImage && Array.isArray(colorWithImage)) {
      for (const colorUpdate of colorWithImage) {
        // Try to find existing color with same hexCode
        const existingColor = product.colors.find(
          (color) => color.hexCode === colorUpdate.hexCode
        );

        if (existingColor) {
          // Update existing color
          const updatedColor = await ProductColor.findByIdAndUpdate(
            existingColor._id,
            {
              $set: {
                name: colorUpdate.nameOfColor || existingColor.name,
                hexCode: colorUpdate.hexCode,
                // Append new images to existing ones
                images: [...existingColor.images, ...colorUpdate.images],
              },
            },
            { new: true }
          );
          updatedColorIds.push(updatedColor._id);
        } else {
          // Create new color
          const newColor = new ProductColor({
            name: colorUpdate.nameOfColor,
            hexCode: colorUpdate.hexCode,
            images: colorUpdate.images,
          });
          const savedColor = await newColor.save();
          updatedColorIds.push(savedColor._id);
        }
      }
    }

    // Keep colors that weren't updated
    const unchangedColors = product.colors
      .filter(
        (color) =>
          !colorWithImage?.some((update) => update.hexCode === color.hexCode)
      )
      .map((color) => color._id);

    // Combine updated and unchanged color IDs
    const finalColorIds = [...updatedColorIds, ...unchangedColors];

    // Update product
    const updateData = {
      ...(name && { name }),
      ...(sizes && { sizes }),
      ...(price && { price }),
      ...(description && { description }),
      ...(category && { category }),
      ...(discount !== undefined && { discount }),
      colors: finalColorIds,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).populate("colors");

    res
      .status(200)
      .send(
        new ApiResponse(200, "Update product success", updatedProduct, true)
      );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send(new ApiResponse(500, "Error from server", error.message, false));
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product first
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .send(new ApiResponse(404, "Product not found", null, false));
    }

    // Delete associated colors and their images
    if (product.colors && product.colors.length > 0) {
      await ProductColor.deleteMany({ _id: { $in: product.colors } });
    }

    // Delete the product
    await Product.findByIdAndDelete(id);

    res
      .status(200)
      .send(new ApiResponse(200, "Delete product success", null, true));
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
export { addProduct, getProductById, getAllProduct, updateProduct, deleteProduct };
