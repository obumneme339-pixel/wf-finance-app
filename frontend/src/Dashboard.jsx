import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Send, ShieldCheck, Activity, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard({ user, setUser, setCurrentView }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [usdToConvert, setUsdToConvert] = useState('');
  const [cryptoType, setCryptoType] = useState('btc');
  const [cryptoMessage, setCryptoMessage] = useState('');

  // THIS IS THE NEW LINE FOR DEPLOYMENT
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Updated to use API_URL
        const response = await fetch(`${API_URL}/api/transaction/history/${user.email}`);
        const data = await response.json();
        if (Array.isArray(data)) setTransactions(data);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [user.email, API_URL]);

  // Handle Crypto Convert
  const handleCryptoConvert = async (e) => {
    e.preventDefault();
    setCryptoMessage('');
    try {
      // Updated to use API_URL
      const response = await fetch(`${API_URL}/api/crypto/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, cryptoType, usdAmount: Number(usdToConvert) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      setCryptoMessage(data.message);
      setUsdToConvert('');
      
      localStorage.setItem('wfUser', JSON.stringify(data.user));
      setUser(data.user);
      
    } catch (err) {
      setCryptoMessage(err.message);
    }
  };

  return (
    <div className="p-8 text-white max-w-6xl mx-auto">
      
      {/* 1. THE GREEN DASHBOARD HEADER */}
      <div className="bg-gradient-to-br from-[#0f3d33] to-[#1b5e4f] p-8 rounded-3xl shadow-2xl relative overflow-hidden mb-8">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl"></div>

        <div className="flex justify-between items-start mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800/50 border border-emerald-500/30 flex items-center justify-center text-xl font-bold text-emerald-300">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-emerald-200 text-sm">Good Evening</p>
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-mono font-bold text-emerald-100">
              {currentTime.toLocaleTimeString()}
            </p>
            <p className="text-sm text-emerald-300">
              {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="mb-8 relative z-10">
          <p className="text-emerald-200 font-medium mb-1 flex items-center gap-2">
            Available Balance
            <button onClick={() => setShowBalance(!showBalance)} className="hover:text-white transition-colors">
              {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </p>
          <h3 className="text-5xl font-extrabold tracking-tight text-white">
            {showBalance ? `$${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD` : '****.** USD'}
          </h3>
        </div>

        <div className="bg-black/20 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10 border border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-emerald-300">Your Account Number</p>
              <div className="flex items-center gap-2">
                <p className="font-bold text-lg tracking-wider text-white">0438... <span className="text-emerald-400 text-sm ml-2 bg-emerald-900/50 px-2 py-0.5 rounded-md">Active</span></p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={() => setCurrentView('transactions')} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
              <Activity className="w-4 h-4" /> Transactions
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
              <ArrowUpRight className="w-4 h-4" /> Top up
            </button>
          </div>
        </div>
      </div>

      {/* 2. GRID: CHART AND CRYPTO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* REAL INTERACTIVE CHART */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-80 flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Cash Flow</h3>
          <div className="flex-1 w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={transactions.slice().reverse().map(tx => ({
                  name: new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                  amount: tx.amount
                }))}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CRYPTO WALLET SECTION */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-80 flex flex-col overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">Crypto Wallet 🪙</h3>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-800/50 p-3 rounded-xl flex items-center gap-3 border border-slate-700">
              <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026" alt="BTC" className="w-6 h-6" />
              <div>
                <p className="font-bold text-xs">BTC</p>
                <p className="text-[10px] text-slate-400">{user.crypto?.btc.toFixed(4) || "0.0000"}</p>
              </div>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl flex items-center gap-3 border border-slate-700">
              <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026" alt="ETH" className="w-6 h-6" />
              <div>
                <p className="font-bold text-xs">ETH</p>
                <p className="text-[10px] text-slate-400">{user.crypto?.eth.toFixed(4) || "0.0000"}</p>
              </div>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl flex items-center gap-3 border border-slate-700">
              <img src="https://cryptologos.cc/logos/tether-usdt-logo.png?v=026" alt="USDT" className="w-6 h-6" />
              <div>
                <p className="font-bold text-xs">USDT</p>
                <p className="text-[10px] text-slate-400">{user.crypto?.usdt.toFixed(2) || "0.00"}</p>
              </div>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl flex items-center gap-3 border border-slate-700">
              <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026" alt="USDC" className="w-6 h-6" />
              <div>
                <p className="font-bold text-xs">USDC</p>
                <p className="text-[10px] text-slate-400">{user.crypto?.usdc.toFixed(2) || "0.00"}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleCryptoConvert} className="flex flex-col gap-2 mt-auto">
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="USD (e.g. 100)" 
                value={usdToConvert}
                onChange={(e) => setUsdToConvert(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white flex-1 text-sm focus:outline-none focus:border-emerald-500"
                required
              />
              <select 
                value={cryptoType} 
                onChange={(e) => setCryptoType(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="btc">BTC</option>
                <option value="eth">ETH</option>
                <option value="usdt">USDT</option>
                <option value="usdc">USDC</option>
              </select>
            </div>
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg transition-colors text-sm">
              Convert to Crypto
            </button>
          </form>
          {cryptoMessage && <p className="text-emerald-400 mt-2 text-xs text-center">{cryptoMessage}</p>}
        </div>
      </div>

      {/* 3. QUICK ACTIONS */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-1">What would you like to do today?</h3>
        <p className="text-slate-400 mb-6">Choose from our popular actions below</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => setCurrentView('transfer')} className="bg-[#d4f762] hover:bg-[#c2e654] text-slate-900 p-6 rounded-2xl flex flex-col items-center gap-4 transition-transform hover:scale-105 shadow-[0_0_20px_rgba(212,247,98,0.2)]">
            <div className="w-12 h-12 bg-white/40 rounded-full flex items-center justify-center">
              <Send className="w-6 h-6" />
            </div>
            <span className="font-bold text-lg">Send Money</span>
          </button>

          <button onClick={() => setCurrentView('profile')} className="bg-slate-900 border border-slate-800 hover:bg-slate-800 p-6 rounded-2xl flex flex-col items-center gap-4 transition-colors">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-blue-400">
              <Activity className="w-6 h-6" />
            </div>
            <span className="font-medium text-slate-300">Account Info</span>
          </button>
        </div>
      </div>

      {/* 4. RECENT TRANSACTIONS */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <p className="text-slate-400">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="text-slate-400 text-sm">No recent transactions.</p>
          ) : (
            transactions.map((tx) => {
              const isSender = tx.senderEmail === user.email;
              return (
                <div key={tx._id} className="flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-xl transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSender ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {isSender ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium">{isSender ? tx.receiverEmail : tx.senderEmail}</p>
                      <p className="text-xs text-slate-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${isSender ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isSender ? '-' : '+'}${tx.amount.toFixed(2)}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
      
    </div>
  );
}

export default Dashboard;