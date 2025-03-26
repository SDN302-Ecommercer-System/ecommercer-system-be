import User from "../models/User.js";

export const uploadSingleImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const userId = req.userIdUploadImage;
  
  const userFound = await User.findById(userId);

  if (userFound) {
    userFound.avatar = req.file.path;
    await userFound.save();
  }

  return res.json({ url: req.file.path });
};

export const uploadMultipleImages = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }
  const urls = req.files.map((file) => file.path);
  return res.json({ urls });
};
