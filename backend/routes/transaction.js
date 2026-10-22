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

    const newTransaction = new Transaction({ senderEmail, receiverEmail, amount, type: 'transfer' });
    await newTransaction.save();

    // 🔥 REAL-TIME MAGIC: Emit updates to both users
    const io = req.app.get('socketio');
    io.to(receiverEmail).emit("balance_updated", { 
      message: `You received $${amount} from ${sender.name}`, 
      newBalance: receiver.balance 
    });
    io.to(senderEmail).emit("balance_updated", { 
      message: `You sent $${amount} to ${receiver.name}`, 
      newBalance: sender.balance 
    });

    res.json({ message: `Successfully sent $${amount} to ${receiver.name}!` });
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

    // 🔥 REAL-TIME MAGIC
    const io = req.app.get('socketio');
    io.to(email).emit("balance_updated", { 
      message: `Deposit of $${amount} successful!`, 
      newBalance: user.balance 
    });

    res.json({ message: `Successfully deposited $${amount}!`, user });
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

// @route   POST /api/transaction/wire-transfer
// @desc    Process a wire transfer with PIN verification
router.post('/wire-transfer', async (req, res) => {
  try {
    const { email, amount, pin, beneficiaryName, accountNumber, bankName } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1. Verify the Transaction PIN
    const isPinMatch = await bcrypt.compare(pin, user.transactionPin);
    if (!isPinMatch) {
      return res.status(400).json({ message: "Invalid Transaction PIN" });
    }

    // 2. Check balance
    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // 3. Deduct balance
    user.balance -= amount;
    await user.save();

    // 4. Save Transaction
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

// @route   POST /api/transaction/local-transfer
// @desc    Process a local transfer with PIN verification
router.post('/local-transfer', async (req, res) => {
  try {
    const { 
      email, amount, pin, beneficiaryName, 
      accountNumber, bankName, accountType, purpose 
    } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1. Verify Transaction PIN
    const isPinMatch = await bcrypt.compare(pin, user.transactionPin);
    if (!isPinMatch) {
      return res.status(400).json({ message: "Invalid Transaction PIN" });
    }

    // 2. Check Balance
    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // 3. Deduct Balance
    user.balance -= amount;
    await user.save();

    // 4. Save Transaction
    const newTransaction = new Transaction({
      senderEmail: email,
      receiverEmail: `${beneficiaryName} (${bankName} - ${accountNumber})`,
      amount: amount,
      type: 'local_transfer'
    });
    await newTransaction.save();

    res.json({ message: "Local transfer successful!", user });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;