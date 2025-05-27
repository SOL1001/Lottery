const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Optionally, protect routes using `authMiddleware` and check for admin role

router.get("/", authMiddleware, userController.getAllUsers);
router.delete("/:id", authMiddleware, userController.deleteUser);

module.exports = router;
