const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Transfer Route
router.post('/transfer', async (req, res) => {
  try {
    const { senderEmail, receiverEmail, amount } = req.body;

    const sender = await User.findOne({ email: senderEmail });
    const receiver = await User.findOne({ email: receiverEmail });

    if (!sender) return res.status(404).json({ message: "Sender not found" });
    if (!receiver) return res.status(404).json({ message: "Receiver not found" });
    if (senderEmail === receiverEmail) return res.status(400).json({ message: "Cannot send money to yourself" });
    if (sender.balance < amount) return res.status(400).json({ message: "Insufficient funds" });

    sender.balance -= amount;
    receiver.balance += amount;
    await sender.save();
    await receiver.save();

    const newTransaction = new Transaction({
      senderEmail,
      receiverEmail,
      amount
    });
    await newTransaction.save();

    res.json({ message: `Successfully sent $${amount} to ${receiver.name}!` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// History Route (THIS IS THE ONE CAUSING THE 404)
router.get('/history/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;
    const transactions = await Transaction.find({
      $or: [{ senderEmail: userEmail }, { receiverEmail: userEmail }]
    }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;