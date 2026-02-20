const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
const generationController = require("../controllers/generation.controller.js");

router.post("/", authMiddleware, generationController.generateImage);

module.exports = router;