import React, { useState } from 'react';
import { ArrowLeft, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';

function Deposit({ user, setUser, setCurrentView }) {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleDeposit = async (e) => {
    e.preventDefault();
    setError('');
    
    const depositAmount = Number(amount);
    if (depositAmount < 100) {
      setError("Minimum deposit amount is $100.");
      return;
    }

    setIsProcessing(true);

    // Simulate a 2-second processing delay for realism
    setTimeout(async () => {
      try {
        const response = await fetch(`${API_URL}/api/transaction/deposit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, amount: depositAmount }),
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        // Update local user state and storage
        localStorage.setItem('wfUser', JSON.stringify(data.user));
        setUser(data.user);
        
        setIsProcessing(false);
        setIsSuccess(true);
        
      } catch (err) {
        setError(err.message);
        setIsProcessing(false);
      }
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="p-8 text-white max-w-md mx-auto flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Deposit Successful</h2>
        <p className="text-slate-400 text-center mb-8">
          Your wallet has been funded with <span className="text-white font-bold">${Number(amount).toFixed(2)}</span>.
        </p>
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 text-white max-w-md mx-auto">
      <button 
        onClick={() => setCurrentView('dashboard')}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <h2 className="text-3xl font-bold mb-2">Fund Wallet</h2>
      <p className="text-slate-400 mb-8">Add money securely to your WF Finance account.</p>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleDeposit} className="space-y-6">
        <div>
          <label className="block text-sm text-slate-400 mb-2">Amount to Deposit ($)</label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-slate-400 font-bold">$</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 pl-8 text-2xl font-bold text-white focus:outline-none focus:border-emerald-500"
              placeholder="0.00"
              required
              min="100"
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">Minimum deposit: $100.00</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-400" /> Payment Method
          </h3>
          <div className="bg-slate-800 p-4 rounded-lg flex items-center justify-between border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-blue-700 rounded flex items-center justify-center text-xs font-bold">VISA</div>
              <span className="text-sm">•••• 4321</span>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-[10px] text-slate-500 mt-3 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Payments are secured with 256-bit encryption.
          </p>
        </div>

        <button 
          type="submit" 
          disabled={isProcessing}
          className="w-full bg-[#d4f762] hover:bg-[#c2e654] text-slate-900 font-bold py-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {isProcessing ? 'Processing Payment...' : `Pay $${amount || '0.00'}`}
        </button>
      </form>
    </div>
  );
}

export default Deposit;