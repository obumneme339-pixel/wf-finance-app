import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Plus, ArrowRight } from 'lucide-react';

function Dashboard({ user, setUser, setCurrentView }) {
  const [showBalance, setShowBalance] = useState(true);
  const [transactions, setTransactions] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const cryptoPrices = { btc: 65000, eth: 3500, usdt: 1 };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${API_URL}/api/transaction/history/${user.email}`);
        const data = await response.json();
        if (Array.isArray(data)) setTransactions(data.slice(0, 3)); 
      } catch (err) {
        console.error(err);
      }
    };
    fetchTransactions();
  }, [user.email, API_URL]);

  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto pb-24 bg-[#f8fafc] min-h-screen">
      
      <div className="mb-6">
        <h1 className="text-[26px] font-extrabold text-gray-900 tracking-tight">Welcome back, {user.name}</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">Here's an overview of your account activity.</p>
      </div>

      {/* BALANCE CARD */}
      <div className="bg-gradient-to-br from-[#115e3f] to-[#0a3a27] rounded-3xl p-6 shadow-xl mb-8 relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>

        <div className="flex justify-between items-center mb-2">
          <p className="text-xs font-bold text-emerald-100 tracking-wider">AVAILABLE BALANCE</p>
          <button onClick={() => setCurrentView('deposit')} className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 backdrop-blur-sm transition">
            <Plus className="w-4 h-4" /> Fund
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-[34px] font-extrabold tracking-tight">
            £{showBalance ? user.balance.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '••••••'}
          </h2>
          <button onClick={() => setShowBalance(!showBalance)} className="text-emerald-200 hover:text-white">
            {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>

        {/* CRYPTO BALANCES */}
        <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-100 mb-1">
              <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026" alt="BTC" className="w-4 h-4" />
              <span className="text-xs font-bold">BTC</span>
            </div>
            <p className="font-extrabold text-[15px]">{user.crypto?.btc.toFixed(6) || '0.000000'}</p>
            <p className="text-[11px] font-medium text-emerald-300 mt-0.5">
              ≈ £{((user.crypto?.btc || 0) * cryptoPrices.btc).toLocaleString('en-GB', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-emerald-100 mb-1">
              <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026" alt="ETH" className="w-4 h-4" />
              <span className="text-xs font-bold">ETH</span>
            </div>
            <p className="font-extrabold text-[15px]">{user.crypto?.eth.toFixed(6) || '0.000000'}</p>
            <p className="text-[11px] font-medium text-emerald-300 mt-0.5">
              ≈ £{((user.crypto?.eth || 0) * cryptoPrices.eth).toLocaleString('en-GB', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-emerald-100 mb-1">
              <img src="https://cryptologos.cc/logos/tether-usdt-logo.png?v=026" alt="USDT" className="w-4 h-4" />
              <span className="text-xs font-bold">USDT</span>
            </div>
            <p className="font-extrabold text-[15px]">{user.crypto?.usdt.toFixed(2) || '0.00'}</p>
            <p className="text-[11px] font-medium text-emerald-300 mt-0.5">
              ≈ £{((user.crypto?.usdt || 0) * cryptoPrices.usdt).toLocaleString('en-GB', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </p>
          </div>
        </div>
      </div>

      {/* SEND MONEY GRID - EXACT MATCH */}
      <div className="mb-8">
        <h3 className="text-[13px] font-bold text-gray-500 tracking-widest mb-3 uppercase">Send Money</h3>
        <div className="grid grid-cols-2 gap-3">
          
          <button onClick={() => setCurrentView('international-transfer')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-3 hover:shadow-md transition">
            <div className="w-11 h-11 bg-[#eff6ff] rounded-xl flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="font-extrabold text-gray-900 text-[15px]">Wire Transfer</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">International bank</p>
            </div>
          </button>
          
          <button onClick={() => setCurrentView('transfer')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-3 hover:shadow-md transition">
            <div className="w-11 h-11 bg-[#f5f3ff] rounded-xl flex items-center justify-center">
               {/* Exact Purple Chat Icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#8b5cf6">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="font-extrabold text-gray-900 text-[15px]">Local Transfer</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">Domestic bank</p>
            </div>
          </button>

          <button onClick={() => setCurrentView('paypal')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-3 hover:shadow-md transition">
            <div className="w-11 h-11 bg-[#eff6ff] rounded-xl flex items-center justify-center p-2">
              {/* Crisp PayPal SVG */}
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M7.076 21.337H4.614c-.34 0-.59-.31-.51-.64l2.74-16.92c.06-.38.4-.65.78-.65h7.29c2.15 0 3.81.5 4.66 1.41.78.83 1.03 1.96.77 3.44-.29 1.65-1.16 3.02-2.45 3.86-1.18.77-2.67 1.16-4.42 1.16H9.96c-.3 0-.55.22-.59.52l-1.12 7.02c-.04.25-.26.44-.52.44z" fill="#003087"/>
                <path d="M18.565 6.986c-.4 2.28-1.5 3.84-3.14 4.58-1.16.52-2.5.76-4.03.76H9.74c-.3 0-.55.22-.59.52l-1.1 7.02c-.03.2-.2.35-.4.35H5.15c-.22 0-.38-.2-.33-.41l2.7-16.88c.04-.25.26-.43.51-.43h7.83c1.65 0 2.86.34 3.55 1.03.4.4.58.9.54 1.5-.04.52-.2 1.06-.39 1.96z" fill="#001c64"/>
                <path d="M10.313 11.043H8.92c-.16 0-.3.12-.32.28l-.62 3.93c-.02.13.08.25.21.25h.66c.24 0 .45-.17.49-.4l.38-2.45c.02-.13.14-.23.27-.23h.53c.86 0 1.51-.2 1.95-.59.45-.4.74-1 .88-1.8.12-.71.02-1.26-.3-1.65-.31-.39-.91-.59-1.76-.59H8.06c-.16 0-.3.12-.32.28l-.85 5.39c-.02.13.08.25.21.25h.75c.15 0 .27-.11.29-.26l.5-3.17c.02-.13.14-.23.27-.23h.91c.47 0 .8.1 1 .3.21.2.26.52.17.98-.07.41-.21.7-.42.88-.2.18-.53.27-.97.27z" fill="#0070e0"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="font-extrabold text-gray-900 text-[15px]">PayPal</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">Send via PayPal</p>
            </div>
          </button>

          {/* PERFECT SKRILL LOGO */}
          <button className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-3 hover:shadow-md transition">
            <div className="w-11 h-11 bg-[#fdf2f8] rounded-xl flex items-center justify-center p-1.5">
              <div className="w-full h-full bg-[#8a0053] rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-black text-[13px] tracking-tighter">Skrill</span>
              </div>
            </div>
            <div className="text-left">
              <p className="font-extrabold text-gray-900 text-[15px]">Skrill</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">Send via Skrill</p>
            </div>
          </button>
        </div>
      </div>

      {/* CRYPTO TRANSFER GRID */}
      <div className="mb-8">
        <h3 className="text-[13px] font-bold text-gray-500 tracking-widest mb-3 uppercase">Crypto Transfer</h3>
        <div className="grid grid-cols-3 gap-3">
          <button className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:shadow-md transition">
            <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026" alt="BTC" className="w-9 h-9" />
            <div className="text-center mt-1">
              <p className="font-extrabold text-gray-900 text-sm">Bitcoin</p>
              <p className="text-[10px] font-medium text-gray-500">BTC Network</p>
            </div>
          </button>
          <button className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:shadow-md transition">
            <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026" alt="ETH" className="w-9 h-9" />
            <div className="text-center mt-1">
              <p className="font-extrabold text-gray-900 text-sm">Ethereum</p>
              <p className="text-[10px] font-medium text-gray-500">ETH Network</p>
            </div>
          </button>
          <button className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:shadow-md transition">
            <img src="https://cryptologos.cc/logos/tether-usdt-logo.png?v=026" alt="USDT" className="w-9 h-9" />
            <div className="text-center mt-1">
              <p className="font-extrabold text-gray-900 text-sm">Tether</p>
              <p className="text-[10px] font-medium text-gray-500">USDT (TRC-20)</p>
            </div>
          </button>
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[13px] font-bold text-gray-500 tracking-widest uppercase">Recent Transactions</h3>
          <button onClick={() => setCurrentView('transactions')} className="text-sm font-bold text-[#0f5e40] flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${tx.senderEmail === user.email ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                  {tx.senderEmail === user.email ? '↑' : '↓'}
                </div>
                <div>
                  <p className="font-extrabold text-gray-900 text-[15px]">
                    {tx.type === 'deposit' ? 'Deposit' : (tx.senderEmail === user.email ? 'Transfer Sent' : 'Received')}
                  </p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">
                    {tx.senderEmail === user.email ? tx.receiverEmail : tx.senderEmail}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-extrabold text-[15px] ${tx.senderEmail === user.email ? 'text-gray-900' : 'text-emerald-600'}`}>
                  {tx.senderEmail === user.email ? '-' : '+'}£{tx.amount.toFixed(2)}
                </p>
                <p className="text-[11px] font-medium text-gray-400 mt-1">Pending</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;