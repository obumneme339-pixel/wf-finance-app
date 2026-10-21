import React, { useState } from 'react';
import { ArrowLeft, CreditCard, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

function Deposit({ user, setUser, setCurrentView }) {
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Format card number with spaces (e.g., 1234 5678 9012 3456)
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 16) value = value.slice(0, 16); // Max 16 digits
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  // Format expiry (MM/YY)
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setExpiry(value);
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setError('');
    
    const depositAmount = Number(amount);
    if (depositAmount < 100) {
      setError("Minimum deposit amount is $100.");
      return;
    }
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError("Please enter a valid 16-digit card number.");
      return;
    }
    if (cvv.length < 3) {
      setError("Please enter a valid CVV.");
      return;
    }

    setIsProcessing(true);

    // Simulate a 3-second processing delay (like a real bank authorization)
    setTimeout(async () => {
      try {
        const response = await fetch(`${API_URL}/api/transaction/deposit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, amount: depositAmount }),
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        localStorage.setItem('wfUser', JSON.stringify(data.user));
        setUser(data.user);
        
        setIsProcessing(false);
        setIsSuccess(true);
        
      } catch (err) {
        setError(err.message);
        setIsProcessing(false);
      }
    }, 3000);
  };

  if (isSuccess) {
    return (
      <div className="p-8 text-white max-w-md mx-auto flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Deposit Successful</h2>
        <p className="text-slate-400 text-center mb-8">
          Your wallet has been funded with <span className="text-white font-bold">${Number(amount).toFixed(2)}</span>.
        </p>
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="w-full bg-[#d4f762] hover:bg-[#c2e654] text-slate-900 font-bold py-4 rounded-xl transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 text-white max-w-md mx-auto pb-20">
      <button 
        onClick={() => setCurrentView('dashboard')}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <h2 className="text-3xl font-bold mb-2">Fund Wallet</h2>
      <p className="text-slate-400 mb-8">Add money securely to your account.</p>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleDeposit} className="space-y-6">
        
        {/* Amount Section */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">Amount to Deposit ($)</label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-slate-400 font-bold text-xl">$</span>
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
        </div>

        {/* Payment Details Section */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-2 border-b border-slate-800 pb-3">
            <CreditCard className="w-4 h-4 text-blue-400" /> Card Details
          </h3>
          
          <div>
            <label className="block text-xs text-slate-500 mb-1">Cardholder Name</label>
            <input 
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 uppercase"
              placeholder="JOHN DOE"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Card Number</label>
            <div className="relative">
              <input 
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 font-mono tracking-widest"
                placeholder="0000 0000 0000 0000"
                required
              />
              <CreditCard className="absolute right-3 top-3 w-5 h-5 text-slate-500" />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs text-slate-500 mb-1">Expiry Date</label>
              <input 
                type="text"
                value={expiry}
                onChange={handleExpiryChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 font-mono"
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-slate-500 mb-1">CVV</label>
              <div className="relative">
                <input 
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 font-mono"
                  placeholder="123"
                  required
                />
                <Lock className="absolute right-3 top-3 w-4 h-4 text-slate-500" />
              </div>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isProcessing || !amount || !cardNumber || !expiry || !cvv || !cardName}
          className="w-full bg-[#d4f762] hover:bg-[#c2e654] text-slate-900 font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Authorizing Payment...
            </span>
          ) : (
            `Pay $${amount || '0.00'}`
          )}
        </button>
        
        <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500" /> Payments are secured with 256-bit encryption.
        </p>
      </form>
    </div>
  );
}

export default Deposit;