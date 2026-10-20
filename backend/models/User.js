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
  default: false, 
},
isBanned: {
  type: Boolean,
  default: false, // Everyone starts unbanned
},
  balance: {
    type: Number,
    default: 0, // Everyone starts with $0
  },
  crypto: {
    btc: { type: Number, default: 0 },
    eth: { type: Number, default: 0 },
    usdt: { type: Number, default: 0 },
    usdc: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);