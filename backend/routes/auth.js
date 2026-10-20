const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      balance: 0
    });

    // 4. Save to database
    await user.save();

    res.status(201).json({ message: "User registered successfully! 🎉" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

// 2. Check if the user is banned!
if (user.isBanned) {
  return res.status(403).json({ message: "Your account has been suspended. Please contact support." });
}

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // 3. If successful, send user data including isAdmin and crypto
    res.json({ 
      message: "Login successful! Welcome back. 🏦", 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        balance: user.balance, 
        crypto: user.crypto || { btc: 0, eth: 0, usdt: 0, usdc: 0 }, 
        isAdmin: user.isAdmin || false // Safety fallback if it's missing
      } 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;