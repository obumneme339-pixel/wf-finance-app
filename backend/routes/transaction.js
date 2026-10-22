const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const bcrypt = require('bcryptjs');

// Transfer Route (Email to Email)
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

    const newTransaction = new Transaction({ senderEmail, receiverEmail, amount, type: 'transfer' });
    await newTransaction.save();

    const io = req.app.get('socketio');
    if (io) {
      io.to(receiverEmail).emit("balance_updated", { message: `You received $${amount} from ${sender.firstName}`, newBalance: receiver.balance });
      io.to(senderEmail).emit("balance_updated", { message: `You sent $${amount} to ${receiver.firstName}`, newBalance: sender.balance });
    }

    res.json({ message: `Successfully sent $${amount} to ${receiver.firstName}!` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// History Route
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

// Deposit Route
router.post('/deposit', async (req, res) => {
  try {
    const { email, amount } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.balance += amount;
    await user.save();

    const newTransaction = new Transaction({
      senderEmail: 'Bank Deposit',
      receiverEmail: email,
      amount: amount,
      type: 'deposit'
    });
    await newTransaction.save();

    const io = req.app.get('socketio');
    if (io) {
      io.to(email).emit("balance_updated", { message: `Deposit of $${amount} successful!`, newBalance: user.balance });
    }

    res.json({ message: `Successfully deposited $${amount}!`, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Wire Transfer Route
router.post('/wire-transfer', async (req, res) => {
  try {
    const { email, amount, pin, beneficiaryName, accountNumber, bankName } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPinMatch = await bcrypt.compare(pin, user.transactionPin);
    if (!isPinMatch) return res.status(400).json({ message: "Invalid Transaction PIN" });
    if (user.balance < amount) return res.status(400).json({ message: "Insufficient funds" });

    user.balance -= amount;
    await user.save();

    const newTransaction = new Transaction({
      senderEmail: email,
      receiverEmail: `${beneficiaryName} (${bankName} - ${accountNumber})`,
      amount: amount,
      type: 'wire_transfer'
    });
    await newTransaction.save();

    res.json({ message: "Wire transfer successful!", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// External Transfer Route (PayPal, Skrill)
router.post('/external-transfer', async (req, res) => {
  try {
    const { email, amount, platform, recipientAccount } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const transferAmount = Number(amount);
    if (user.balance < transferAmount) return res.status(400).json({ message: "Insufficient funds" });

    user.balance -= transferAmount;
    await user.save();

    const newTransaction = new Transaction({
      senderEmail: email,
      receiverEmail: recipientAccount, 
      amount: transferAmount,
      type: `${platform.toLowerCase()}_withdrawal` 
    });
    await newTransaction.save();

    res.json({ message: `Successfully sent £${transferAmount} via ${platform}!`, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Crypto Transfer Route
router.post('/crypto-transfer', async (req, res) => {
  try {
    const { email, cryptoType, amount, walletAddress, pin } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPinMatch = await bcrypt.compare(pin, user.transactionPin);
    if (!isPinMatch) return res.status(400).json({ message: "Invalid Transaction PIN" });

    const transferAmount = Number(amount);
    if (!user.crypto || user.crypto[cryptoType] < transferAmount) {
      return res.status(400).json({ message: `Insufficient ${cryptoType.toUpperCase()} funds` });
    }

    user.crypto[cryptoType] -= transferAmount;
    await user.save();

    const newTransaction = new Transaction({
      senderEmail: email,
      receiverEmail: walletAddress,
      amount: transferAmount,
      type: `${cryptoType}_transfer`
    });
    await newTransaction.save();

    res.json({ message: `${cryptoType.toUpperCase()} transfer successful!`, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Verify Internal Account Number
router.post('/verify-account', async (req, res) => {
  try {
    const { accountNumber } = req.body;
    const user = await User.findOne({ accountNumber });
    if (!user) return res.status(404).json({ message: "Account not found" });
    res.json({ name: `${user.firstName} ${user.lastName}`, accountNumber: user.accountNumber });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Internal Transfer Route
router.post('/internal-transfer', async (req, res) => {
  try {
    const { email, recipientAccountNumber, amount, pin, description } = req.body;

    const sender = await User.findOne({ email });
    const receiver = await User.findOne({ accountNumber: recipientAccountNumber });

    if (!sender) return res.status(404).json({ message: "Sender not found" });
    if (!receiver) return res.status(404).json({ message: "Recipient not found" });
    if (sender.accountNumber === receiver.accountNumber) return res.status(400).json({ message: "Cannot transfer to yourself" });

    const isPinMatch = await bcrypt.compare(pin, sender.transactionPin);
    if (!isPinMatch) return res.status(400).json({ message: "Invalid Transaction PIN" });
    if (sender.balance < amount) return res.status(400).json({ message: "Insufficient funds" });

    sender.balance -= amount;
    receiver.balance += amount;
    await sender.save();
    await receiver.save();

    const newTransaction = new Transaction({
      senderEmail: sender.email,
      receiverEmail: receiver.email,
      amount: amount,
      type: 'internal_transfer',
      description: description || 'Internal Transfer'
    });
    await newTransaction.save();

    const io = req.app.get('socketio');
    if (io) {
      io.to(receiver.email).emit("balance_updated", { message: `Received £${amount} from ${sender.firstName}`, newBalance: receiver.balance });
    }

    res.json({ message: "Transfer successful!", user: sender });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;