// controllers/generation.controller.js
const generationService = require("../services/generation.service");
const User = require("../models/user.model");

exports.generateImage = async (req, res, next) => {
  try {
    const { prompt, style_id, size } = req.body;

    // 1️⃣ Generate image & save to DB
    const generation = await generationService.generateImageForUser(
      req.user._id,
      { prompt, style_id, size }
    );

    // 2️⃣ Increment user's generation count
    await User.findByIdAndUpdate(req.user._id, { $inc: { generationCount: 1 } });

    res.status(201).json({ success: true, generation });
  } catch (err) {
    console.error("Image generation error:", err.message);
    next(err); // will be handled by error.middleware.js
  }
};

// GET /api/generations -> user-specific
exports.getUserGenerations = async (req, res, next) => {
  try {
    const generations = await generationService.getUserGenerations(req.user._id);
    res.status(200).json({ success: true, generations });
  } catch (err) {
    next(err);
  }
};

// GET /api/generations/all -> all generations (public/admin)
exports.getGenerationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const generation = await generationService.getGenerationById(id, req.user._id);

    res.status(200).json({ success: true, generation });
  } catch (err) {
    // If the generation is not found, return 404
    if (err.message === "Generation not found") {
      return res.status(404).json({ success: false, message: err.message });
    }
    next(err);
  }
};