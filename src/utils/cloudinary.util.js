// utils/cloudinary.util.js
const cloudinary = require("../config/cloudinary");
const axios = require("axios");
const streamifier = require("streamifier");

exports.uploadImageFromUrl = async (imageUrl, folder = "generated-images") => {
  try {
    // fetch image as buffer
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    // upload buffer to Cloudinary
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "image" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  } catch (err) {
    throw new Error("Cloudinary upload failed: " + err.message);
  }
};