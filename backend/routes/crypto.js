const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST /api/crypto/convert
// @desc    Convert Fiat USD to Crypto
router.post('/convert', async (req, res) => {
  try {
    const { email, cryptoType, usdAmount } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.balance < usdAmount) {
      return res.status(400).json({ message: "Insufficient USD funds" });
    }

    // Mock Exchange Rates
    const rates = {
      btc: 65000,
      eth: 3500,
      usdt: 1,
      usdc: 1
    };

    if (!rates[cryptoType]) {
      return res.status(400).json({ message: "Invalid crypto type" });
    }

    const cryptoAmount = usdAmount / rates[cryptoType];

    // Deduct USD, Add Crypto
user.balance -= usdAmount;

// SAFETY CHECK: If an old user doesn't have crypto fields yet, create them
if (!user.crypto) {
  user.crypto = { btc: 0, eth: 0, usdt: 0, usdc: 0 };
}

user.crypto[cryptoType] += cryptoAmount;
    await user.save();

    res.json({ 
      message: `Successfully converted $${usdAmount} to ${cryptoAmount.toFixed(6)} ${cryptoType.toUpperCase()}`,
      user
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;