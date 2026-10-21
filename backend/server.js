const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http'); // NEW
const { Server } = require('socket.io'); // NEW
require('dotenv').config();

const app = express();
const server = http.createServer(app); // NEW: Wrap express app

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://wf-finance-app.vercel.app'], // Allow frontend
    methods: ["GET", "POST", "PUT"]
  }
});

// Make 'io' accessible in our routes (like transaction.js)
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
  
  // Users join a "room" named after their email
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

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server!" });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { // MUST use server.listen, not app.listen
  console.log(`Server is running on port ${PORT}`);
});