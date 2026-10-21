import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Send, ShieldCheck, Activity, ArrowUpRight, ArrowDownLeft, Plus, History, CreditCard, HelpCircle, Globe, User, BarChart3, Clock, Copy, Wallet, RefreshCw } from 'lucide-react';
import { io } from "socket.io-client";

function Dashboard({ user, setUser, setCurrentView }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveNotification, setLiveNotification] = useState(null);

  // Crypto States
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [usdToConvert, setUsdToConvert] = useState('');
  const [cryptoType, setCryptoType] = useState('usdt');
  const [cryptoMessage, setCryptoMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // 1. Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Fetch Transactions
  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/transaction/history/${user.email}`);
      const data = await response.json();
      if (Array.isArray(data)) setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Fetch Web3 Deposit Address
  const fetchCryptoAddress = async () => {
    try {
      const response = await fetch(`${API_URL}/api/wallet/address/${user.email}`);
      const data = await response.json();
      setCryptoAddress(data.address);
    } catch (err) {
      console.error("Failed to fetch address", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCryptoAddress();
  }, [user.email, API_URL]);

  // 4. Real-Time WebSockets
  useEffect(() => {
    const socket = io(API_URL);
    socket.emit("join_room", user.email);

    socket.on("balance_updated", (data) => {
      const updatedUser = { ...user, balance: data.newBalance };
      setUser(updatedUser);
      localStorage.setItem('wfUser', JSON.stringify(updatedUser));

      setLiveNotification(data.message);
      fetchTransactions(); // Refresh list
      setTimeout(() => setLiveNotification(null), 5000);
    });

    return () => socket.disconnect();
  }, [user.email, API_URL]);

  // 5. Simulated Crypto Conversion (Buy Crypto)
  const handleCryptoConvert = async (e) => {
    e.preventDefault();
    setCryptoMessage('');
    try {
      const response = await fetch(`${API_URL}/api/crypto/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, cryptoType, usdAmount: Number(usdToConvert) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      setCryptoMessage(data.message);
      setUsdToConvert('');
      
      // Update user state to reflect new crypto balances
      localStorage.setItem('wfUser', JSON.stringify(data.user));
      setUser(data.user);
      
    } catch (err) {
      setCryptoMessage(err.message);
    }
  };

  const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="p-4 md:p-8 text-white max-w-6xl mx-auto space-y-6 pb-20 relative">
      
      {/* REAL-TIME TOAST */}
      {liveNotification && (
        <div className="fixed top-20 right-4 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-[0_0_30px_rgba(5,150,105,0.5)] z-50 animate-bounce border border-emerald-400">
          <p className="font-bold flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-white rounded-full animate-ping"></span> Real-time Update!
          </p>
          <p className="text-xs mt-1 text-emerald-100">{liveNotification}</p>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#0f3d33] to-[#1b5e4f] p-5 md:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800/50 border border-emerald-500/30 flex items-center justify-center text-lg font-bold text-emerald-300">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-emerald-200 text-xs">Good Evening</p>
              <h2 className="text-lg md:text-xl font-bold text-white">{user.name}</h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm md:text-base font-mono font-bold text-emerald-100">
              {currentTime.toLocaleTimeString()}
            </p>
            <p className="text-[10px] md:text-sm text-emerald-300">
              {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="mb-6 relative z-10">
          <p className="text-emerald-200 text-sm font-medium mb-1 flex items-center gap-2">
            Available Balance
            <button onClick={() => setShowBalance(!showBalance)} className="hover:text-white transition-colors">
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </p>
          <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            {showBalance ? `$${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '****.**'} 
            <span className="text-lg md:text-2xl text-emerald-200 ml-2">USD</span>
          </h3>
        </div>
      </div>

      {/* THE NEW CRYPTO HUB */}
      <div className="bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-2xl">
        <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-emerald-400" /> Crypto Hub
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Real Web3 Deposit Address */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <h4 className="text-sm font-medium mb-2 text-white">Receive Crypto (Web3)</h4>
            <p className="text-xs text-slate-400 mb-3">
              Send USDT (ERC-20) from your Crypto.com wallet. Funds arrive instantly.
            </p>
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 font-mono text-[10px] md:text-xs text-emerald-400 break-all select-all flex justify-between items-center gap-2">
              <span className="truncate">{cryptoAddress || "Generating..."}</span>
              <button onClick={() => navigator.clipboard.writeText(cryptoAddress)} className="p-1 hover:bg-slate-800 rounded">
                <Copy className="w-4 h-4 text-slate-400 hover:text-white" />
              </button>
            </div>
          </div>

          {/* Right: Simulated Crypto Conversion (Buy/Sell) */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <h4 className="text-sm font-medium mb-2 text-white">Buy Crypto (Swap USD)</h4>
            <form onSubmit={handleCryptoConvert} className="flex gap-2">
              <input 
                type="number" 
                placeholder="USD Amount" 
                value={usdToConvert}
                onChange={(e) => setUsdToConvert(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white flex-1 text-sm focus:outline-none focus:border-emerald-500"
                required
              />
              <select 
                value={cryptoType} 
                onChange={(e) => setCryptoType(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="usdt">USDT</option>
                <option value="btc">BTC</option>
                <option value="eth">ETH</option>
                <option value="usdc">USDC</option>
              </select>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-lg text-sm transition-colors">
                Buy
              </button>
            </form>
            {cryptoMessage && <p className="text-emerald-400 mt-2 text-xs">{cryptoMessage}</p>}
            
            {/* Display Crypto Balances */}
            <div className="mt-4 flex gap-2 overflow-x-auto text-xs">
              <span className="bg-slate-900 px-2 py-1 rounded text-slate-300">BTC: {user.crypto?.btc.toFixed(4) || "0"}</span>
              <span className="bg-slate-900 px-2 py-1 rounded text-slate-300">ETH: {user.crypto?.eth.toFixed(4) || "0"}</span>
              <span className="bg-slate-900 px-2 py-1 rounded text-slate-300">USDT: {user.crypto?.usdt.toFixed(2) || "0"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS (Deposit, Send, Info, History) ... (Same as before) */}
      <div>
        <h3 className="text-xl md:text-2xl font-bold mb-1">What would you like to do today?</h3>
        <p className="text-slate-400 text-sm mb-4">Choose from our popular actions below</p>
        
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <button onClick={() => setCurrentView('profile')} className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white p-4 md:p-6 rounded-2xl flex flex-col items-center gap-3 transition-colors shadow-sm">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
            </div>
            <span className="font-bold text-sm md:text-base">Account Info</span>
          </button>

          <button onClick={() => setCurrentView('transfer')} className="bg-[#d4f762] hover:bg-[#c2e654] text-slate-900 p-4 md:p-6 rounded-2xl flex flex-col items-center gap-3 transition-transform hover:scale-105 shadow-[0_0_20px_rgba(212,247,98,0.15)]">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/40 rounded-full flex items-center justify-center">
              <Send className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="font-bold text-sm md:text-base">Send Money</span>
          </button>

          <button onClick={() => setCurrentView('deposit')} className="bg-[#e6f4ea] hover:bg-[#d4ebd9] text-[#0f3d33] p-4 md:p-6 rounded-2xl flex flex-col items-center gap-3 transition-colors shadow-sm">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Plus className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
            </div>
            <span className="font-bold text-sm md:text-base">Deposit</span>
          </button>

          <button onClick={() => setCurrentView('transactions')} className="bg-[#f3e8ff] hover:bg-[#e9d5ff] text-[#4c1d95] p-4 md:p-6 rounded-2xl flex flex-col items-center gap-3 transition-colors shadow-sm">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              <History className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
            </div>
            <span className="font-bold text-sm md:text-base">History</span>
          </button>
        </div>
      </div>

      {/* RECENT TRANSACTIONS ... (Same as before) */}
      <div className="bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg md:text-xl font-semibold">Recent Transactions</h3>
          <button onClick={() => setCurrentView('transactions')} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1">View all &rsaquo;</button>
        </div>
        
        <div className="w-full text-sm">
          <div className="grid grid-cols-3 text-slate-500 font-medium mb-3 px-2 border-b border-slate-800 pb-2">
            <span>AMOUNT</span>
            <span className="text-center">TYPE</span>
            <span className="text-right">STATUS</span>
          </div>
          
          <div className="flex flex-col gap-3">
            {isLoading ? (
              <p className="text-slate-400 text-sm">Loading...</p>
            ) : transactions.length === 0 ? (
              <p className="text-slate-400 text-sm">No recent transactions.</p>
            ) : (
              transactions.slice(0, 5).map((tx) => {
                const isSender = tx.senderEmail === user.email;
                return (
                  <div key={tx._id} className="grid grid-cols-3 items-center px-2 py-2 hover:bg-slate-800/50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSender ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {isSender ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                      </div>
                      <span className="font-semibold">${tx.amount.toFixed(2)}</span>
                    </div>
                    <div className="text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${isSender ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {isSender ? 'Debit' : 'Credit'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded">Processed</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ACCOUNT STATISTICS ... (Same as before) */}
      <div className="bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-2xl">
        <h3 className="text-lg md:text-xl font-semibold mb-6">Account Statistics</h3>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#e6f4ea] flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Transaction Limit</p>
              <p className="text-xl font-bold">$500,000.00</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#fef3c7] flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Pending Transactions</p>
              <p className="text-xl font-bold">$0.00</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#e6f4ea] flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Transaction Volume</p>
              <p className="text-xl font-bold">${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK TRANSFER ... (Same as before) */}
      <div className="bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-2xl">
        <h3 className="text-lg md:text-xl font-semibold mb-6">Quick Transfer</h3>
        <div className="flex flex-col gap-4">
          <button onClick={() => setCurrentView('transfer')} className="flex items-center justify-between p-2 hover:bg-slate-800/50 rounded-xl transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#d4f762] flex items-center justify-center">
                <User className="w-5 h-5 text-[#0f3d33]" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white">Local Transfer</p>
                <p className="text-xs text-slate-400">0% Handling charges</p>
              </div>
            </div>
            <span className="text-slate-500">&rsaquo;</span>
          </button>
          <button onClick={() => setCurrentView('international-transfer')} className="flex items-center justify-between p-2 hover:bg-slate-800/50 rounded-xl transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#d4f762] flex items-center justify-center">
                <Globe className="w-5 h-5 text-[#0f3d33]" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white">International Transfer</p>
                <p className="text-xs text-slate-400">Global reach, 0% fee</p>
              </div>
            </div>
            <span className="text-slate-500">&rsaquo;</span>
          </button>
        </div>
      </div>

      {/* NEED HELP ... (Same as before) */}
      <div className="bg-[#d4f762] rounded-2xl p-6 flex flex-col items-center text-center shadow-[0_0_20px_rgba(212,247,98,0.1)]">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3">
          <HelpCircle className="w-6 h-6 text-[#0f3d33]" />
        </div>
        <h3 className="text-[#0f3d33] font-bold text-lg mb-1">Need Help?</h3>
        <p className="text-[#0f3d33]/70 text-sm">Our support team is here to assist you 24/7</p>
      </div>
      
    </div>
  );
}

export default Dashboard;