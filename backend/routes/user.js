const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @route   PUT /api/user/update
// @desc    Update user profile (name, email, password)
router.put('/update', async (req, res) => {
  try {
    const { userId, name, email, newPassword } = req.body;

    // 1. Find the user
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Update Name and Email
    user.name = name;
    user.email = email;

    // 3. If they typed a new password, hash it and update it
    if (newPassword && newPassword.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    // 4. Send back the updated user data (without the password!)
    res.json({
      message: "Profile updated successfully! ✅",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        crypto: user.crypto,
        isAdmin: user.isAdmin
      }
    });

  } catch (err) {
    console.error(err.message);
    // If the new email is already used by someone else, MongoDB throws error code 11000
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email is already in use by another account." });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;