const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const User = require('../models/User');

// @route   GET /api/wallet/address/:email
// @desc    Get or generate a crypto deposit address for a user
router.get('/address/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // If the user already has an address, return it
    if (user.cryptoAddress) {
      return res.json({ address: user.cryptoAddress });
    }

    // Otherwise, generate a new random wallet for them
    const newWallet = ethers.Wallet.createRandom();
    
    user.cryptoAddress = newWallet.address;
    await user.save();

    res.json({ address: user.cryptoAddress });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;