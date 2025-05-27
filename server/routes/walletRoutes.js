const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const walletController = require("../controllers/walletController");

router.get("/balance", auth, walletController.getBalance);
router.post("/deposit", auth, walletController.deposit);
router.post("/withdraw", auth, walletController.withdraw);
router.get("/transactions", auth, walletController.getTransactionHistory);

module.exports = router;
