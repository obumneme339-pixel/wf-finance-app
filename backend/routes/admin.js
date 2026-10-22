const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   PUT /api/admin/update-balance
// @desc    Update a user's balance
router.put('/update-balance', async (req, res) => {
  try {
    const { email, newBalance } = req.body;
    const user = await User.findOneAndUpdate(
      { email: email },
      { balance: newBalance },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: `Successfully updated ${user.name}'s balance to $${newBalance}!`, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update a user's name or email
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/admin/ban-user/:id
// @desc    Ban or Unban a user
router.put('/ban-user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Toggle the ban status
    user.isBanned = !user.isBanned;
    await user.save();

    res.json({ 
      message: user.isBanned ? `User ${user.name} has been banned.` : `User ${user.name} has been unbanned.`,
      isBanned: user.isBanned
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

const Transaction = require('../models/Transaction'); // Make sure this is at the top!

// @route   GET /api/admin/pending-transactions
// @desc    Get all pending transactions
router.get('/pending-transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find({ status: 'Pending' }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/admin/approve-transaction/:id
// @desc    Approve a pending transaction
router.put('/approve-transaction/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    transaction.status = 'Completed';
    await transaction.save();

    res.json({ message: "Transaction approved and completed!", transaction });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;