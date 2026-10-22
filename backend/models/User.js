const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String, required: false },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  accountType: { type: String, required: true },
  currency: { type: String, required: true, default: 'USD' },
  accountNumber: { type: String, unique: true }, // NEW: For internal transfers
  
  password: { type: String, required: true },
  transactionPin: { type: String, required: true },
  
  isAdmin: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  balance: { type: Number, default: 0 },
  crypto: {
    btc: { type: Number, default: 0 },
    eth: { type: Number, default: 0 },
    usdt: { type: Number, default: 0 },
    usdc: { type: Number, default: 0 }
  },
  cryptoAddress: { type: String, unique: true, sparse: true }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);