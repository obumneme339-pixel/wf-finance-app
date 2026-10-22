const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register a new user with full KYC details
router.post('/register', async (req, res) => {
  try {
    const { 
      firstName, middleName, lastName, username, email, 
      phone, country, accountType, currency, transactionPin, password 
    } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });
    
    let userByUsername = await User.findOne({ username });
    if (userByUsername) return res.status(400).json({ message: "Username is taken" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedPin = await bcrypt.hash(transactionPin, salt);

    // Generate a random 10-digit account number
    const generatedAccountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    user = new User({
      firstName, middleName, lastName, username, email, 
      phone, country, accountType, currency, 
      password: hashedPassword, 
      transactionPin: hashedPin, 
      balance: 0,
      accountNumber: generatedAccountNumber // Added here
    });

    await user.save();

    res.status(201).json({ message: "Account created successfully! 🎉" });
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

    let user = await User.findOne({ 
      $or: [{ email: email }, { username: email }] 
    });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (user.isBanned) return res.status(403).json({ message: "Account suspended. Contact support." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({ 
      message: "Login successful! Welcome back. 🏦", 
      user: { 
        id: user._id, 
        name: `${user.firstName} ${user.lastName}`,
        email: user.email, 
        balance: user.balance, 
        accountNumber: user.accountNumber, // Send account number to frontend
        crypto: user.crypto || { btc: 0, eth: 0, usdt: 0, usdc: 0 }, 
        isAdmin: user.isAdmin 
      } 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;