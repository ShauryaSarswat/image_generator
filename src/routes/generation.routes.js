const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
const generationController = require("../controllers/generation.controller");

// Existing routes
router.post("/", authMiddleware, generationController.generateImage);
router.get("/", authMiddleware, generationController.getUserGenerations);

// New route: get single generation by ID
router.get("/:id", authMiddleware, generationController.getGenerationById);

module.exports = router;