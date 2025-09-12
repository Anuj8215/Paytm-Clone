const express = require("express");
const { authmiddleware } = require("../middleware/auth");
const { Account, User } = require("../db");
const mongoose = require("mongoose");

const router = express.Router();

//!SECTION - GET BALANCE

router.get("/balance", authmiddleware, async (req, res) => {
  const account = await Account.findOne({ userId: req.userId });
  res.json({ balance: account.balance });
});
//!SECTION - TRANSFER MONEY
router.post("/transfer", authmiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { to, amount } = req.body;

    const fromAccount = await Account.findOne({ userId: req.userId }).session(
      session
    );
    if (!fromAccount || fromAccount.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const toUser = await User.findById(to);
    if (!toUser) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid account" });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid account" });
    }

    // Deduct & add balances
    fromAccount.balance -= amount;
    toAccount.balance += amount;

    await fromAccount.save();
    await toAccount.save();

    await session.commitTransaction();
    res.json({ message: "Transfer successful" });
  } catch (err) {
    await session.abortTransaction();
    console.error("Transfer error:", err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    session.endSession();
  }
});

module.exports = router;
