const { ethers } = require('ethers');
const User = require('./models/User');
const Transaction = require('./models/Transaction');

// Connect to the Sepolia Testnet (A free testing blockchain)
const provider = new ethers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');

// The contract address for testnet USDT (You can find these online)
const USDT_CONTRACT_ADDRESS = '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06'; 

const usdtAbi = [
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

const usdtContract = new ethers.Contract(USDT_CONTRACT_ADDRESS, usdtAbi, provider);

const startCryptoListener = (io) => {
  console.log("👀 Listening for incoming crypto deposits...");

  usdtContract.on("Transfer", async (from, to, amount, event) => {
    try {
      // 1. Check if the receiver is one of our bank users
      const user = await User.findOne({ cryptoAddress: to });
      
      if (user) {
        // 2. Convert the raw blockchain amount to a readable number (USDT has 6 decimals)
        const fiatAmount = Number(ethers.formatUnits(amount, 6));
        
        console.log(`💰 Deposit detected! ${fiatAmount} USDT sent to ${user.name}`);

        // 3. Add to user balance
        user.balance += fiatAmount;
        await user.save();

        // 4. Log the transaction
        const newTransaction = new Transaction({
          senderEmail: 'Crypto Deposit',
          receiverEmail: user.email,
          amount: fiatAmount,
          type: 'crypto_deposit'
        });
        await newTransaction.save();

        // 5. Emit real-time update to the frontend via Socket.io
        io.to(user.email).emit("balance_updated", { 
          message: `Crypto Deposit of $${fiatAmount} received!`, 
          newBalance: user.balance 
        });
      }
    } catch (error) {
      console.error("Error processing crypto deposit:", error);
    }
  });
};

module.exports = startCryptoListener;