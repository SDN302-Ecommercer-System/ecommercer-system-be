import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import {
  uploadMultipleImages,
  uploadSingleImage,
} from "../controller/cloudinary.controller.js";
import dotenv from "dotenv";
import { verifyToken } from "../middleware/auth.middleware.js";

dotenv.config();

const uploadRouter = express.Router();

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình storage cho multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
  },
});

const upload = multer({ storage });

// Định nghĩa routes
uploadRouter.post(
  "/upload-single",
  verifyToken,
  upload.single("image"),
  uploadSingleImage
);
uploadRouter.post(
  "/upload-multiple",
  upload.array("images", 5),
  uploadMultipleImages
);

export default uploadRouter;
