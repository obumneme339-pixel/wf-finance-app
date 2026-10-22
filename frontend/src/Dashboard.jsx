import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Plus, ArrowRight } from 'lucide-react';

function Dashboard({ user, setUser, setCurrentView }) {
  const [showBalance, setShowBalance] = useState(true);
  const [transactions, setTransactions] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${API_URL}/api/transaction/history/${user.email}`);
        const data = await response.json();
        if (Array.isArray(data)) setTransactions(data.slice(0, 3)); // Just get top 3 for dashboard
      } catch (err) {
        console.error(err);
      }
    };
    fetchTransactions();
  }, [user.email, API_URL]);

  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto pb-24 bg-[#f8fafc] min-h-screen">
      
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h1>
        <p className="text-sm text-gray-500 mt-1">Here's an overview of your account activity.</p>
      </div>

      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-[#115e3f] to-[#0a3a27] rounded-3xl p-6 shadow-xl mb-8 relative overflow-hidden text-white">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>

        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-emerald-100 tracking-wide">AVAILABLE BALANCE</p>
          <button onClick={() => setCurrentView('deposit')} className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 backdrop-blur-sm transition">
            <Plus className="w-4 h-4" /> Fund
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-4xl font-bold tracking-tight">
            £{showBalance ? user.balance.toFixed(2) : '••••••'}
          </h2>
          <button onClick={() => setShowBalance(!showBalance)} className="text-emerald-200 hover:text-white">
            {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>

        {/* Crypto Balances inside the card */}
        <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
          <div>
            <div className="flex items-center gap-1 text-emerald-200 mb-1">
              <span className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">₿</span>
              <span className="text-xs font-medium">BTC</span>
            </div>
            <p className="font-bold text-sm">{user.crypto?.btc.toFixed(6) || '0.000000'}</p>
            <p className="text-[10px] text-emerald-300">≈ £0.00</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-emerald-200 mb-1">
              <span className="w-4 h-4 bg-indigo-400 rounded-full flex items-center justify-center text-[10px] font-bold text-white">Ξ</span>
              <span className="text-xs font-medium">ETH</span>
            </div>
            <p className="font-bold text-sm">{user.crypto?.eth.toFixed(6) || '0.000000'}</p>
            <p className="text-[10px] text-emerald-300">≈ £0.00</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-emerald-200 mb-1">
              <span className="w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">₮</span>
              <span className="text-xs font-medium">USDT</span>
            </div>
            <p className="font-bold text-sm">{user.crypto?.usdt.toFixed(2) || '0.00'}</p>
            <p className="text-[10px] text-emerald-300">≈ £0.00</p>
          </div>
        </div>
      </div>

      {/* Send Money Grid */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-400 tracking-wider mb-3 uppercase">Send Money</h3>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setCurrentView('international-transfer')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-3 hover:shadow-md transition">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              🏦
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900 text-sm">Wire Transfer</p>
              <p className="text-[11px] text-gray-500 mt-0.5">International bank</p>
            </div>
          </button>
          
          <button onClick={() => setCurrentView('transfer')} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-3 hover:shadow-md transition">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              📍
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900 text-sm">Local Transfer</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Domestic bank</p>
            </div>
          </button>

          <button className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-3 hover:shadow-md transition">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold italic">
              P
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900 text-sm">PayPal</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Send via PayPal</p>
            </div>
          </button>

          <button className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-3 hover:shadow-md transition">
            <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center font-bold italic">
              S
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900 text-sm">Skrill</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Send via Skrill</p>
            </div>
          </button>
        </div>
      </div>

      {/* Crypto Transfer Grid */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-400 tracking-wider mb-3 uppercase">Crypto Transfer</h3>
        <div className="grid grid-cols-3 gap-3">
          <button className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:shadow-md transition">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-xl font-bold">₿</div>
            <div className="text-center">
              <p className="font-bold text-gray-900 text-sm">Bitcoin</p>
              <p className="text-[10px] text-gray-500">BTC Network</p>
            </div>
          </button>
          <button className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:shadow-md transition">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xl font-bold">Ξ</div>
            <div className="text-center">
              <p className="font-bold text-gray-900 text-sm">Ethereum</p>
              <p className="text-[10px] text-gray-500">ETH Network</p>
            </div>
          </button>
          <button className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:shadow-md transition">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-xl font-bold">₮</div>
            <div className="text-center">
              <p className="font-bold text-gray-900 text-sm">Tether</p>
              <p className="text-[10px] text-gray-500">USDT (TRC-20)</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase">Recent Transactions</h3>
          <button onClick={() => setCurrentView('transactions')} className="text-sm font-bold text-[#0f5e40] flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.senderEmail === user.email ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                  {tx.senderEmail === user.email ? '↑' : '↓'}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    {tx.type === 'deposit' ? 'Deposit' : (tx.senderEmail === user.email ? 'Domestic Transfer' : 'Received')}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {tx.senderEmail === user.email ? tx.receiverEmail : tx.senderEmail}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${tx.senderEmail === user.email ? 'text-gray-900' : 'text-emerald-600'}`}>
                  {tx.senderEmail === user.email ? '-' : '+'}£{tx.amount.toFixed(2)}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">Pending</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;