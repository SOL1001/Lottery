const Wallet = require("../models/Wallet");

// Get current wallet balance
exports.getBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) return res.status(404).json({ message: "0" });
    res.json({ balance: wallet.balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Deposit money
exports.deposit = async (req, res) => {
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });

  try {
    let wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      wallet = new Wallet({ user: req.user.id, balance: amount });
    } else {
      wallet.balance += amount;
    }
    await wallet.save();
    res.json({ message: "Deposit successful", balance: wallet.balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Withdraw money
exports.withdraw = async (req, res) => {
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });

  try {
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    wallet.balance -= amount;
    await wallet.save();
    res.json({ message: "Withdrawal successful", balance: wallet.balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getTransactionHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
