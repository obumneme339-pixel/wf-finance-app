const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  senderEmail: {
    type: String,
    required: true,
  },
  receiverEmail: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    default: 'transfer'
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);