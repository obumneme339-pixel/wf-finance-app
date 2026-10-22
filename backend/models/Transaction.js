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
  },
  description: {
    type: String,
    default: 'Transfer'
  },
  // NEW: Status field for Pending vs Completed
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Completed'
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);