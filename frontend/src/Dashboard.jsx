import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Send, ShieldCheck, Activity, ArrowUpRight, ArrowDownLeft, ArrowRightLeft } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard({ user, setUser, setCurrentView }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [usdToConvert, setUsdToConvert] = useState('');
  const [cryptoType, setCryptoType] = useState('btc');
  const [cryptoMessage, setCryptoMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
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
    fetchTransactions();
  }, [user.email, API_URL]);

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
      localStorage.setItem('wfUser', JSON.stringify(data.user));
      setUser(data.user);
    } catch (err) {
      setCryptoMessage(err.message);
    }
  };

  return (
    <div className="p-4 md:p-8 text-white max-w-6xl mx-auto space-y-6">
      
      {/* 1. THE GREEN DASHBOARD HEADER (Mobile Optimized) */}
      <div className="bg-gradient-to-br from-[#0f3d33] to-[#1b5e4f] p-5 md:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-xl"></div>

        {/* Top Row: Avatar, Greeting, Time */}
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

        {/* Middle Row: Balance */}
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

        {/* Bottom Row: Account Number & Actions */}
        <div className="bg-black/20 rounded-2xl p-3 md:p-4 flex flex-col md:flex-row justify-between items-center gap-3 relative z-10 border border-white/5">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] text-emerald-300">Account Number</p>
              <p className="font-bold text-sm tracking-wider text-white">0438... <span className="text-emerald-400 text-[10px] ml-1 bg-emerald-900/50 px-1.5 py-0.5 rounded-md">Active</span></p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button onClick={() => setCurrentView('transactions')} className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-xs font-medium transition-colors">
              <Activity className="w-4 h-4" /> Transactions
            </button>
            <button onClick={() => setCurrentView('transfer')} className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-xs font-medium transition-colors">
              <ArrowUpRight className="w-4 h-4" /> Top up
            </button>
          </div>
        </div>
      </div>

      {/* 2. WHAT WOULD YOU LIKE TO DO TODAY? (Mobile Optimized) */}
      <div>
        <h3 className="text-xl md:text-2xl font-bold mb-1">What would you like to do today?</h3>
        <p className="text-slate-400 text-sm mb-4">Choose from our popular actions below</p>
        
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <button onClick={() => setCurrentView('profile')} className="bg-slate-900 border border-slate-800 hover:bg-slate-800 p-4 md:p-6 rounded-2xl flex flex-col items-center gap-3 transition-colors">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-800 rounded-full flex items-center justify-center text-blue-400">
              <Activity className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="font-medium text-sm md:text-base text-slate-300">Account Info</span>
          </button>

          <button onClick={() => setCurrentView('transfer')} className="bg-[#d4f762] hover:bg-[#c2e654] text-slate-900 p-4 md:p-6 rounded-2xl flex flex-col items-center gap-3 transition-transform hover:scale-105 shadow-[0_0_20px_rgba(212,247,98,0.15)]">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/40 rounded-full flex items-center justify-center">
              <Send className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="font-bold text-sm md:text-lg">Send Money</span>
          </button>
        </div>
      </div>

      {/* 3. RECENT TRANSACTIONS (Mobile Optimized) */}
      <div className="bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-2xl">
        <h3 className="text-lg md:text-xl font-semibold mb-4">Recent Transactions</h3>
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <p className="text-slate-400 text-sm">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="text-slate-400 text-sm">No recent transactions.</p>
          ) : (
            transactions.slice(0, 5).map((tx) => { // Show only top 5 on mobile
              const isSender = tx.senderEmail === user.email;
              return (
                <div key={tx._id} className="flex items-center justify-between p-2 md:p-3 hover:bg-slate-800/50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${isSender ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {isSender ? <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" /> : <ArrowDownLeft className="w-4 h-4 md:w-5 md:h-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm md:text-base">{isSender ? tx.receiverEmail : tx.senderEmail}</p>
                      <p className="text-[10px] md:text-xs text-slate-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={`font-bold text-sm md:text-base ${isSender ? 'text-rose-400' : 'text-emerald-400'}`}>
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