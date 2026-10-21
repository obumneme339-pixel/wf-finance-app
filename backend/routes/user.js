const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false, // Admin panel access
  },
  isBanned: {
    type: Boolean,
    default: false, // Account suspension
  },
  balance: {
    type: Number,
    default: 0, // Fiat USD balance
  },
  crypto: {
    btc: { type: Number, default: 0 },
    eth: { type: Number, default: 0 },
    usdt: { type: Number, default: 0 },
    usdc: { type: Number, default: 0 }
  },
  cryptoAddress: {
    type: String,
    unique: true,
    sparse: true // Allows existing users to be null until they generate a Web3 wallet address
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);