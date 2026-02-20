const axios = require("axios");
const cloudinary = require("../config/cloudinary");
const Generation = require("../models/generation.model");

exports.generateImage = async (req, res) => {
  try {
    const { prompt, style_id = 4, size = "1-1" } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    // 1️⃣ Call Flux Free RapidAPI
    const apiResponse = await axios.post(
      "https://ai-text-to-image-generator-flux-free-api.p.rapidapi.com/aaaaaaaaaaaaaaaaaiimagegenerator/quick.php",
      { prompt, style_id, size },
      {
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host": process.env.RAPIDAPI_HOST,
          "Content-Type": "application/json",
        },
        responseType: "json",
      }
    );

    const results = apiResponse.data?.final_result;
    if (!results || !results.length) {
      return res.status(500).json({ message: "No image returned from API" });
    }

    // 2️⃣ Use the first image URL from API
    const imageUrlFromApi = results[0].origin;

    // 3️⃣ Upload to Cloudinary
    const cloudinaryUrl = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        imageUrlFromApi,
        { folder: "generated-images", resource_type: "image" },
        (err, result) => {
          if (err) return reject(err);
          resolve(result.secure_url);
        }
      );
    });

    // 4️⃣ Save in MongoDB
    const generation = await Generation.create({
      user: req.user?._id,
      prompt,
      imageUrl: cloudinaryUrl,
    });

    res.status(201).json({ success: true, generation });
  } catch (err) {
    console.error("Image generation error:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: err.response?.data?.message || err.message || "Internal Server Error",
    });
  }
};