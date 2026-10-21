const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http'); 
const { Server } = require('socket.io'); 
require('dotenv').config();

// NEW IMPORT FOR CRYPTO LISTENER
const startCryptoListener = require('./cryptoListener');

const app = express();
const server = http.createServer(app); 

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://wf-finance-app.vercel.app'],
    methods: ["GET", "POST", "PUT"]
  }
});

// Make 'io' accessible in our routes
app.set('socketio', io);

app.use(cors({
  origin: ['http://localhost:5173', 'https://wf-finance-app.vercel.app'],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Database!'))
  .catch((err) => console.log('❌ Database connection error: ', err.message));

// Socket Connection Logic
io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);
  
  socket.on("join_room", (email) => {
    socket.join(email);
    console.log(`User joined room: ${email}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected");
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/crypto', require('./routes/crypto'));
app.use('/api/transaction', require('./routes/transaction'));
app.use('/api/user', require('./routes/user'));

// NEW ROUTE FOR WEB3 WALLET ADDRESS
app.use('/api/wallet', require('./routes/cryptoWallet'));

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server!" });
});

// START THE CRYPTO LISTENER (Listening to the blockchain)
startCryptoListener(io);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { 
  console.log(`Server is running on port ${PORT}`);
});