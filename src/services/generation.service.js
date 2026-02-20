// services/generation.service.js
const Generation = require("../models/generation.model");
const { callTextToImageAPI } = require("../utils/api.util");
const { uploadImageFromUrl } = require("../utils/cloudinary.util");

exports.generateImageForUser = async (userId, { prompt, style_id, size }) => {
  if (!prompt?.trim()) throw new Error("Prompt is required");

  // Call text-to-image API
  const imageUrlFromApi = await callTextToImageAPI({ prompt, style_id, size });

  // Upload to Cloudinary
  const cloudinaryUrl = await uploadImageFromUrl(imageUrlFromApi);

  // Save in DB
  const generation = await Generation.create({
    user: userId,
    prompt,
    imageUrl: cloudinaryUrl,
  });

  return generation;
};

// ✅ Get all generations of a specific user
exports.getUserGenerations = async (userId) => {
  return Generation.find({ user: userId }).sort({ createdAt: -1 });
};

// ✅ Get all generations (admin/public)
exports.getGenerationById = async (generationId, userId) => {
  // Find generation by ID and make sure it belongs to the user
  const generation = await Generation.findOne({ _id: generationId, user: userId });
  if (!generation) throw new Error("Generation not found");
  return generation;
};